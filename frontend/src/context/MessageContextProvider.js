import { createContext, useContext } from "react";
import { useChatContext } from "../context/ChatContextProvider";
import { useUserContext } from "../context/UserContextProvider";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { chats, setChats, chatting } = useChatContext();
  const { user } = useUserContext();
  const shortid = require("shortid");

  const onDeleteMessage = (messageID, conversationID) => {
    try {
      const chat = chats.find((chat) => chat.id === conversationID);
      if (!chat) return;

      const message = chat.messages.find((msg) => msg.id === messageID);
      if (!message) return;

      message.message.wasUnsent = true;
      message.message.text = null;

      localStorage.setItem("chats", JSON.stringify(chats));
      setChats(chats);
    } catch (error) {
      console.error("Error handling message deletion:", error);
    }
  };

  const sendMessage = (messageData, socket) => {
    return new Promise((resolve, reject) => {
      if (!messageData.conversationId) {
        reject("Error: Conversation ID is missing");
        return;
      }

      const id = shortid.generate();
      const messageType = getMessageType(messageData);

      if (messageType === "file") {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(messageData.file);
        fileReader.onloadend = () => {
          const base64String = fileReader.result;
          const message = constructMessage(
            messageData,
            id,
            messageType,
            base64String
          );
          sendMessageOverSocket(message, messageData.chatType, socket);
          resolve("Success");
        };
      } else {
        const message = constructMessage(messageData, id, messageType);
        sendMessageOverSocket(message, messageData.chatType, socket);
        resolve("Success");
      }
    });
  };

  const getMessageType = (messageData) => {
    if (messageData.audio) {
      return "audio";
    } else if (messageData.file) {
      return "file";
    } else {
      return "text";
    }
  };

  const constructMessage = (messageData, id, messageType, fileData = null) => {
    return {
      id: id,
      conversationId: messageData.conversationId,
      sender: user?.username,
      receiver: chatting?.username,
      message: {
        id: id,
        type: messageType,
        ...(messageType === "text" && { text: messageData.text }),
        ...(messageType === "audio" && { data: messageData.audio }),
        ...(messageType === "file" && {
          type: messageData.file.type.split("/")[0],
          name: messageData.file.name,
          file: fileData,
          text: messageData.text,
        }),
      },
      time: Date.now(),
    };
  };

  const sendMessageOverSocket = (message, chatType, socket) => {
    const eventName = chatType === "group" ? "sendGroupMessage" : "chat";
    socket.emit(eventName, message);
  };

  return (
    <MessageContext.Provider value={{ onDeleteMessage, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
