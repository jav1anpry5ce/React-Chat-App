import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import noti from "../assets/noti.wav";
import { useUserContext } from "./UserContextProvider";
import { useChatContext } from "./ChatContextProvider";
import { useMessageContext } from "./MessageContextProvider";
import { useCallContext } from "./CallContextProvider";

const MainContext = createContext();

const socket = io(`https://api.chatapp.home`, {
  transports: ["websocket"]
});

export const MainProvider = ({ children }) => {
  const { user, setUser, handleUserData } = useUserContext();
  const {
    chats,
    setChats,
    swapChat,
    chatting,
    setChatting,
    addMessageToChat,
    updateChats,
    updateGroupChat
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

  const removeUser = (chatId) => {
    if (chatting && chatting.id === chatId) setChatting(null);
    const chats = JSON.parse(localStorage.getItem("chats"));
    const newChats = chats.filter((chat) => chat.id !== chatId);
    localStorage.setItem("chats", JSON.stringify(newChats));
    setChats(newChats);
  };

  const deleteMessage = (messageID, conversationID) => {
    socket.emit("deleteMessage", {
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
    socket.emit("createGroup", groupData);
  };

  const addGroupMember = (data) => {
    socket.emit("addGroupMember", data);
  };

  const changeGroup = (data) => {
    socket.emit("changeGroup", data);
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

    // Set up audio notification
    const audioNotification = new Audio();
    audioNotification.src = "notification-sound.mp3";
    audioNotification.volume = 0.045;

    // Display notification
    const notification = createNotification(data);
    setNotifications((prev) => [...prev, notification]);

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);

    // Play audio notification
    audioNotification.play();
  };

  const createNotification = (data) => {
    const chats = JSON.parse(localStorage.getItem("chats"));
    const chat = chats.find((chat) => chat.id === data.conversationId);

    if (chat && chat.chatType === "group") {
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
    localStorage.removeItem("user");
    localStorage.setItem("chats", JSON.stringify([]));
    setChats([]);
    setUser(null);
  };

  const addUser = (userToAdd) => {
    return new Promise((resolve) => {
      socket.emit("addingUser", { userToAdd, user: user?.username });
      return resolve("success");
    });
  };

  useEffect(() => {
    socket.on("callUser", (data) => {
      setupIncomingCall(data, socket);
    });

    socket.on("ignoreCall", () => {
      resetCall();
    });

    socket.on("endCall", () => {
      resetCall();
    });

    socket.on("busy", () => {
      alert("The user you are trying to call is on another call!");
      window.location.reload();
    });

    return () => {
      socket.off("callUser");
      socket.off("ignoreCall");
      socket.off("endCall");
      socket.off("busy");
    };
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    socket.on("newMessage", async (data) => {
      try {
        swapChat(data);
        addMessageToChat(data);
        const chat = chats.find((chat) => chat.id === data.conversationId);
        if (!chat) {
          socket.emit("getChatInfo", {
            chatId: data.conversationId,
            username: user?.username
          });
        }

        notifyUser(data);
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    });

    socket.on("chatInfo", (chat) => {
      chat.unread = 1;
      localStorage.setItem("chats", JSON.stringify([chat, ...chats]));
      setChats([chat, ...chats]);
    });

    socket.on("messageDeleted", ({ messageID, conversationID }) => {
      onDeleteMessage(messageID, conversationID);
    });

    socket.on("error", ({ message }) => {
      alert(message);
    });

    socket.on("newGroup", (data) => {
      const chat = data;
      const chats = JSON.parse(localStorage.getItem("chats"));
      if (!chats) return;
      if (!chats.find((chat) => chat.username === data.id)) {
        setCreateGroupChat(false);
        setClear(true);
        const newChats = chats.concat(chat);
        localStorage.setItem("chats", JSON.stringify(newChats));
        setChats(newChats);
      }
    });

    socket.on("test", (data) => {
      console.log(data);
    });

    socket.on("chats", (data) => {
      updateChats(data);
    });

    socket.on("groupMemberAdded", (data) => {
      try {
        let chats = JSON.parse(localStorage.getItem("chats")) || [];

        // Find the chat corresponding to the provided conversation ID
        const chat = chats.find((chat) => chat.id === data.id);

        // If the chat does not exist, it means it's a new chat, so add it to the chats array
        if (!chat) {
          chats.push(data);
        } else {
          // Update the members of the existing chat
          chat.members = data.members;
        }

        // Update the local storage with the modified chats array
        localStorage.setItem("chats", JSON.stringify(chats));

        // Update the state with the modified chats array
        setChats(chats);
      } catch (error) {
        console.error("Error handling group member addition:", error);
      }
    });

    socket.on("groupUpdated", (data) => {
      updateGroupChat(data);
    });

    socket.on("callAccepted", (signal) => {
      onCallAccepted(signal);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("error");
      socket.off("newGroup");
      socket.off("groups");
      socket.off("chats");
      socket.off("groupMemberAdded");
      socket.off("callAccepted");
    };
    // eslint-disable-next-line
  }, [chatting, user]);

  useEffect(() => {
    const handleTokenNotValid = () => {
      localStorage.removeItem("user");
      localStorage.setItem("chats", JSON.stringify([]));
      setUser(null);
      setChats([]);
      setChatting(null);
    };

    if (user) {
      socket.emit("userData", user);
      socket.on("connect", () => {
        socket.emit("userData", user);
      });
      if (user.id) socket.emit("getChats", user.username);
    }

    socket.on("tokenNotValid", handleTokenNotValid);
    socket.on("userData", handleUserData);

    return () => {
      socket.off("tokenNotValid", handleTokenNotValid);
      socket.off("userData", handleUserData);
      socket.off("connect");
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const handleUserAdded = (data) => {
      if (data.username !== user?.username) {
        const chats = JSON.parse(localStorage.getItem("chats")) || [];

        // Check if the user already exists in chats
        const existingChat = chats.find((chat) => chat.id === data.id);

        if (!existingChat) {
          const updatedChats = [...chats, data];
          localStorage.setItem("chats", JSON.stringify(updatedChats));
          setChats(updatedChats);
        }
      }
    };

    const handleNotFound = () => {
      alert("User not found!");
    };

    socket.on("userAdded", handleUserAdded);
    socket.on("notFound", handleNotFound);

    return () => {
      socket.off("userAdded", handleUserAdded);
      socket.off("notFound", handleNotFound);
    };
    // eslint-disable-next-line
  }, [user, chats]);

  useEffect(() => {
    let interval = null;
    if (chatting !== null && chatting?.chatType === "private") {
      interval = setInterval(() => {
        socket.emit("online", chatting.username);
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
