import { createContext, useContext, useState, useEffect } from "react";
import { useUserContext } from "./UserContextProvider";
import axios from "axios";
import { saveToDB, readAllFromDB, readFromDB, clearDB } from '../utils/db';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useUserContext();
  const [chats, setChats] = useState([]);
  const [chatting, setChatting] = useState();
  //   const [conversationId, setConversationId] = useState();

  const setUnread = async (chat) => {
    try {
      const existingChat = await readFromDB(chat.conversationId);
      if (!existingChat) return;

      if (
        chat.sender.username === user.username ||
        chatting?.id === existingChat.id
      )
        return;

      if (existingChat.unread) {
        existingChat.unread += 1;
      } else {
        existingChat.unread = 1;
      }

      await saveToDB(existingChat);
      const chats = await readAllFromDB();
      setChats(chats);
    } catch (error) {
      console.error('Error setting unread count:', error);
    }
  };

  const addMessageToChat = async (message, socket) => {
    const chatFromDB = await readFromDB(message.conversationId);
    if (!chatFromDB) {
      socket.emit('getChatInfo', {
        chatId: message.conversationId,
        username: user.username
      });
      return;
    }
    const newChat = { ...chatFromDB };
    newChat.messages.push(message);
    newChat.lastMessage = message.message;
    await saveToDB(newChat);
    const chats = await readAllFromDB();
    setChats(chats);
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

  const updateChats = async (newChats) => {
    try {
      const existingChats = await readAllFromDB();
      if (existingChats.length === 0) {
        newChats.forEach(async (chat) => {
          await saveToDB(chat);
        });
        const chats = await readAllFromDB();
        setChats(chats);
        return;
      }

      newChats.forEach(async (chat) => {
        const existingChat = await readFromDB(chat.id);
        if (!existingChat) {
          chat.unread = chat.messages.length;
          await saveToDB(chat);
          return;
        }
        chat.unread += existingChat.messages.length - chat.messages.length;
        await saveToDB(chat);
      });
      const chats = await readAllFromDB();
      setChats(chats);
    } catch (error) {
      console.error('Error updating chats:', error);
    }
  };

  const updateGroupChat = async (groupChat) => {
    const chat = await readFromDB(groupChat.id);
    if (!chat) {
      await saveToDB(groupChat);
      const chats = await readAllFromDB();
      setChats(chats);
      return;
    }
    chat.name = groupChat.name;
    chat.image = groupChat.image;
    chat.members = groupChat.members;
    await saveToDB(chat);
    const chats = await readAllFromDB();
    setChats(chats);
  };

  const setUnreadToZero = async (conversationId) => {
    try {
      const chat = await readFromDB(conversationId);
      if (!chat) return;
      chat.unread = 0;
      await saveToDB(chat);
      const chats = await readAllFromDB();
      setChats(chats);
    } catch (error) {
      console.error('Error setting unread count:', error);
    }
  };

  const updateChat = async (chat) => {
    const existingChat = await readFromDB(chat.id);
    if (!existingChat) {
      chat.unread = 1;
      await saveToDB(chat);
      const chats = await readAllFromDB();
      setChats(chats);
      return;
    }
    existingChat.unread = 1;
    await saveToDB(existingChat);
    const chats = await readAllFromDB();
    setChats(chats);
  };

  const clearChats = async () => {
    await clearDB();
    const chats = await readAllFromDB();
    setChats(chats);
    setChatting(null);
  };

  const addGroupChat = async (group, setCreateGroupChat, setClear) => {
    const groupChat = await readFromDB(group.id);
    if (!groupChat) {
      await saveToDB(group);
      setCreateGroupChat(false);
      setClear(true);
    }
  };

  const addMemberToGroup = async (data) => {
    try {
      // const chat = chats.find((chat) => chat.id === data.id);
      const chat = await readFromDB(data.id);

      // If the chat does not exist, it means it's a new chat, so add it to the chats array
      if (!chat) {
        await saveToDB(data);
      } else {
        // Update the members of the existing chat
        chat.members = data.members;
        saveToDB(chat);
      }

      const chats = await readAllFromDB();
      setChats(chats);
    } catch (error) {
      console.error('Error handling group member addition:', error);
    }
  };

  useEffect(() => {
    readAllFromDB().then((chats) => {
      setChats(chats);
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        setUnread,
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
