import { createContext, useContext, useState, useEffect } from "react";
import { Manager } from "socket.io-client";
import noti from "../assets/noti.wav";
import { useUserContext } from "./UserContextProvider";
import { useChatContext } from "./ChatContextProvider";
import { useMessageContext } from "./MessageContextProvider";
import { useCallContext } from "./CallContextProvider";
import { readAllFromDB, readFromDB, saveToDB, deleteFromDB } from '../utils/db';

const MainContext = createContext();

const manager = new Manager(`${process.env.REACT_APP_API_URI}`, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 10000
});

const socket = manager.socket('/');

export const MainProvider = ({ children }) => {
  const { user, handleUserData, clearUser } = useUserContext();
  const {
    chats,
    setChats,
    setUnread,
    chatting,
    setChatting,
    addMessageToChat,
    updateChats,
    updateGroupChat,
    clearChats,
    updateChat,
    addGroupChat,
    addMemberToGroup
  } = useChatContext();
  const { onDeleteMessage } = useMessageContext();
  const {
    setupIncomingCall,
    resetCall,
    onCallAccepted,
    calling,
    callAccepted,
    leaveCall
  } = useCallContext();
  const [show, setShow] = useState(false);
  const [conversationId, setConversationId] = useState();
  const [viewing, setViewing] = useState(false);
  const [viewSrc, setViewSrc] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [createGroupChat, setCreateGroupChat] = useState(false);
  const [group, setGroup] = useState(null);
  const [audio] = useState(new Audio(noti));
  const [notifications, setNotifications] = useState([]);
  const [clear, setClear] = useState(false);

  const removeUser = async (chatId) => {
    if (chatting && chatting.id === chatId) setChatting(null);
    await deleteFromDB(chatId);
    const chats = await readAllFromDB();
    setChats(chats);
  };

  const deleteMessage = (messageID, conversationID) => {
    socket.emit('deleteMessage', {
      messageID,
      conversationID,
      username: user?.username
    });
  };

  const createGroup = (groupData) => {
    const admin = {
      username: user?.username,
      name: user?.name,
      image: user?.image,
      admin: 1
    };
    groupData.members.push(admin);
    socket.emit('createGroup', groupData);
  };

  const addGroupMember = (data) => {
    socket.emit('addGroupMember', data);
  };

  const changeGroup = (data) => {
    socket.emit('changeGroup', data);
  };

  const notifyUser = (data) => {
    // Check if the message sender is the current user or if it's for the active conversation
    if (
      data?.sender?.username === user?.username ||
      data.conversationId === chatting?.id
    ) {
      return;
    }

    // Check if there's already a notification with the same ID
    if (notifications.some((n) => n.id === data.id)) {
      return;
    }

    // Display notification
    const notification = createNotification(data);
    setNotifications((prev) => [...prev, notification]);

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const createNotification = (data) => {
    const chats = JSON.parse(localStorage.getItem('chats'));
    const chat = chats.find((chat) => chat.id === data.conversationId);

    if (chat && chat.chatType === 'group') {
      return {
        id: data?.id,
        title: `New message from ${chat?.name}`,
        image: chat?.image,
        data,
        group: true
      };
    } else {
      return {
        id: data?.id,
        title: `New message from ${data?.sender?.name}`,
        image: data?.sender?.image,
        data
      };
    }
  };

  const logout = () => {
    clearUser();
    clearChats();
  };

  const addUser = (userToAdd) => {
    return new Promise((resolve) => {
      socket.emit('addingUser', { userToAdd, user: user?.username });
      return resolve('success');
    });
  };

  useEffect(() => {
    socket.on('callUser', (data) => {
      setupIncomingCall(data, socket);
    });

    socket.on('ignoreCall', () => {
      resetCall();
    });

    socket.on('endCall', () => {
      resetCall();
    });

    socket.on('busy', () => {
      alert('The user you are trying to call is on another call!');
      window.location.reload();
    });

    return () => {
      socket.off('callUser');
      socket.off('ignoreCall');
      socket.off('endCall');
      socket.off('busy');
    };
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    socket.on('newMessage', async (data) => {
      try {
        await addMessageToChat(data, socket);
        await setUnread(data);
        notifyUser(data);
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    });

    socket.on('chatInfo', (chat) => {
      updateChat(chat);
    });

    socket.on('messageDeleted', ({ messageID, conversationID }) => {
      onDeleteMessage(messageID, conversationID);
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    socket.on('newGroup', (data) => {
      addGroupChat(data, setCreateGroupChat, setClear);
    });

    socket.on('test', (data) => {
      console.log(data);
    });

    socket.on('chats', (data) => {
      updateChats(data);
    });

    socket.on('groupMemberAdded', (data) => {
      addMemberToGroup(data);
    });

    socket.on('groupUpdated', (data) => {
      updateGroupChat(data);
    });

    socket.on('callAccepted', (signal) => {
      onCallAccepted(signal);
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageDeleted');
      socket.off('error');
      socket.off('newGroup');
      socket.off('groups');
      socket.off('chats');
      socket.off('groupMemberAdded');
      socket.off('callAccepted');
    };
    // eslint-disable-next-line
  }, [chatting, user]);

  useEffect(() => {
    const handleTokenNotValid = () => {
      clearUser();
      clearChats();
    };

    socket.emit('userData', user);

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('userData', user);
    });

    if (user?.id) socket.emit('getChats', user.username);

    socket.on('tokenNotValid', handleTokenNotValid);
    socket.on('userData', handleUserData);

    return () => {
      socket.off('tokenNotValid', handleTokenNotValid);
      socket.off('userData', handleUserData);
      socket.off('connect');
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const handleUserAdded = async (data) => {
      if (data.username !== user?.username) {
        // Check if the user already exists in chats
        const existingChat = await readFromDB(data.id);
        console.log('existingChat', existingChat);

        if (!existingChat) {
          await saveToDB(data);
          const chats = await readAllFromDB();
          setChats(chats);
        }
      }
    };

    const handleNotFound = () => {
      alert('User not found!');
    };

    socket.on('userAdded', handleUserAdded);
    socket.on('notFound', handleNotFound);

    return () => {
      socket.off('userAdded', handleUserAdded);
      socket.off('notFound', handleNotFound);
    };
    // eslint-disable-next-line
  }, [user, chats]);

  useEffect(() => {
    let interval = null;
    if (chatting !== null && chatting?.chatType === 'private') {
      interval = setInterval(() => {
        socket.emit('online', chatting.username);
      }, 2000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [chatting]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (calling) {
        if (!callAccepted) leaveCall(socket);
      }
    }, 30000);
    return () => clearTimeout(interval);
    // eslint-disable-next-line
  }, [calling, callAccepted]);

  const value = {
    show,
    setShow,
    socket,
    setConversationId,
    conversationId,
    viewing,
    setViewing,
    viewSrc,
    setViewSrc,
    addUser,
    showProfile,
    setShowProfile,
    removeUser,
    deleteMessage,
    createGroup,
    createGroupChat,
    setCreateGroupChat,
    group,
    setGroup,
    addGroupMember,
    changeGroup,
    notifications,
    audio,
    clear,
    setClear,
    logout
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainContext = () => useContext(MainContext);
