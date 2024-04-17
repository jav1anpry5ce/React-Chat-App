import { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./UserContextProvider";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useUserContext();
  const [chats, setChats] = useState([]);
  const [chatting, setChatting] = useState();
  //   const [conversationId, setConversationId] = useState();

  const swapChat = (chat) => {
    try {
      let initialChats = chats;

      // If there are no initial chats, resolve with an empty array
      if (!initialChats) return;

      // Find the conversation in the chats array
      const conversationIndex = initialChats.findIndex(
        (item) => item.id === chat.conversationId
      );

      // If the conversation doesn't exist in the chats array, resolve with the initial chats
      if (conversationIndex === -1) return;

      // Remove the conversation from its current position and add it to the beginning of the array
      const conversation = initialChats.splice(conversationIndex, 1)[0];
      initialChats.unshift(conversation);

      // Update the local storage with the modified chats array
      localStorage.setItem("chats", JSON.stringify(initialChats));

      // Update unread counts and resolve with the updated chats
      setChats([...initialChats]);
      setUnread(chat);
    } catch (error) {
      console.error("Error swapping chats:", error);
    }
  };

  const setUnread = (chat) => {
    try {
      const existing_chat = chats.find(
        (existing_chat) => existing_chat.id === chat.conversationId
      );
      if (!existing_chat) return;

      if (
        chat.sender.username === user.username ||
        chatting?.id === existing_chat.id
      ) {
        // If the current user sent the message or they are chatting in the same conversation, do not increment unread count
        setChats([...chats]);
        return;
      }

      if (existing_chat.unread) {
        existing_chat.unread += 1;
      } else {
        existing_chat.unread = 1;
      }

      localStorage.setItem("chats", JSON.stringify([...chats]));
      setChats([...chats]);
    } catch (error) {
      console.error("Error setting unread count:", error);
    }
  };

  const addMessageToChat = (message, socket) => {
    const chat = chats.find((chat) => chat.id === message.conversationId);
    if (!chat) {
      socket.emit("getChatInfo", {
        chatId: message.conversationId,
        username: user.username
      });
      return;
    }
    chat.messages.push(message);
    chat.lastMessage = message.message;
    localStorage.setItem("chats", JSON.stringify([...chats]));
    setChats([...chats]);
  };

  const fetchMoreMessages = (nextPageUrl) => {
    return new Promise((resolve) => {
      axios
        .get(nextPageUrl, {
          headers: {
            Authorization: `${user.token}`
          }
        })
        .then((res) => {
          return resolve(res.data.messages);
        });
    });
  };

  const updateChats = (newChats) => {
    try {
      if (chats.length === 0) {
        setChats(newChats);
        localStorage.setItem("chats", JSON.stringify(newChats));
        return;
      }

      newChats.forEach((chat) => {
        const existingChatIndex = chats.findIndex((c) => c.id === chat.id);
        if (existingChatIndex !== -1) {
          const existingChat = chats[existingChatIndex];
          existingChat.unread +=
            chat.messages.length - existingChat.messages.length;
          Object.assign(existingChat, chat);
        } else {
          chats.push(chat);
        }
      });

      localStorage.setItem("chats", JSON.stringify([...chats]));
      setChats([...chats]);
    } catch (error) {
      console.error("Error updating chats:", error);
    }
  };

  const updateGroupChat = (groupChat) => {
    const group = chats.find((chat) => chat.id === groupChat.id);
    if (!group) {
      chats.push(groupChat);
      localStorage.setItem("chats", JSON.stringify([...chats]));
      setChats([...chats]);
      return;
    }
    group.name = groupChat.name;
    group.image = groupChat.image;
    group.members = groupChat.members;
    localStorage.setItem("chats", JSON.stringify([...chats]));
    setChats([...chats]);
  };

  const setUnreadToZero = (conversationId) => {
    try {
      const existing_chat = chats.find(
        (existing_chat) => existing_chat.id === conversationId
      );
      if (!existing_chat) return;

      existing_chat.unread = 0;

      localStorage.setItem("chats", JSON.stringify([...chats]));
      setChats([...chats]);
    } catch (error) {
      console.error("Error setting unread count:", error);
    }
  };

  const updateChat = (chat) => {
    chat.unread = 1;
    localStorage.setItem("chats", JSON.stringify([chat, ...chats]));
    setChats([chat, ...chats]);
  };

  const clearChats = () => {
    localStorage.removeItem("chats");
    setChats([]);
    setChatting(null);
  };

  const addGroupChat = (group, setCreateGroupChat, setClear) => {
    if (!chats.find((chat) => chat.username === group.id)) {
      const newChats = chats.concat(group);
      setChats(newChats);
      localStorage.setItem("chats", JSON.stringify(newChats));
      setCreateGroupChat(false);
      setClear(true);
    }
  };

  const addMemberToGroup = (data) => {
    try {
      const chat = chats.find((chat) => chat.id === data.id);

      // If the chat does not exist, it means it's a new chat, so add it to the chats array
      if (!chat) {
        chats.push(data);
      } else {
        // Update the members of the existing chat
        chat.members = data.members;
      }

      // Update the local storage with the modified chats array
      localStorage.setItem("chats", JSON.stringify([...chats]));

      // Update the state with the modified chats array
      setChats([...chats]);
    } catch (error) {
      console.error("Error handling group member addition:", error);
    }
  };

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chats"));
    if (chats) {
      setChats(chats);
      return;
    } else {
      setChats([]);
      localStorage.setItem("chats", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (!chats) localStorage.setItem("chats", JSON.stringify([]));
  }, [chats]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        swapChat,
        chatting,
        setChatting,
        fetchMoreMessages,
        addMessageToChat,
        updateChats,
        updateGroupChat,
        setUnreadToZero,
        clearChats,
        updateChat,
        addGroupChat,
        addMemberToGroup
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
