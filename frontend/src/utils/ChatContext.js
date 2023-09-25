import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import noti from "../assets/noti.wav";
import axios from "axios";
const shortid = require("shortid");
// const ip = "https://backend.javaughnpryce.live:5001";

const ChatContext = createContext();

const socket = io(process.env.REACT_APP_CHATAPP_API);

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(
    JSON.parse(localStorage.getItem("chats")) || []
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [chatting, setChatting] = useState();
  const [show, setShow] = useState(false);
  const [conversationId, setConversationId] = useState();
  const [viewing, setViewing] = useState(false);
  const [viewSrc, setViewSrc] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [calling, setCalling] = useState(null);
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [myVideoStatus, setMyVideoStatus] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [hide, setHide] = useState(false);
  const [type, setType] = useState("");
  const [screenShare, setScreenShare] = useState(false);
  const [createGroupChat, setCreateGroupChat] = useState(false);
  const [group, setGroup] = useState(null);
  const [audio] = useState(new Audio(noti));
  const [notifications, setNotifications] = useState([]);
  const [clear, setClear] = useState(false);

  const myVideo = useRef();
  const userStream = useRef();
  const connectionRef = useRef();
  const screenTrackRef = useRef();

  const getUpdateUser = async (user) => {
    const uUser = await axios.get(
      `${process.env.REACT_APP_CHATAPP_API}/api/user`,
      {
        headers: {
          Authorization: `${user.token}`,
        },
      }
    );
    if (!uUser) return;
    const updatedUser = {
      ...uUser.data,
      token: user.token,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateUser = (user) => {
    const oldUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = {
      ...user,
      token: oldUser.token,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
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
    const user = JSON.parse(localStorage.getItem("user"));
    getUpdateUser(user);
  }, []);

  useEffect(() => {
    socket.on("callUser", (data) => {
      console.log(data);
      if (calling || caller) {
        socket.emit("busy", data.from);
      } else {
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: data.type === "video" ? true : false,
          })
          .then((stream) => {
            setStream(stream);
            setReceivingCall(true);
            setCaller(data);
            setType(data.type);
          })
          .catch(() => {
            alert("Could not start your media!");
            ignoreCall(data.from);
          });
      }
    });
    socket.on("ignoreCall", () => {
      setCalling(null);
      setCallAccepted(false);
      if (connectionRef.current) {
        connectionRef.current.destroy();
        window.location.reload();
      }
    });
    socket.on("endCall", () => {
      setCalling(null);
      setCaller(null);
      setCallAccepted(false);
      setReceivingCall(false);
      if (connectionRef.current) {
        connectionRef.current.destroy();
        window.location.reload();
      }
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
  }, [caller, calling]);

  useEffect(() => {
    if ((calling || callAccepted) && stream) {
      if (type === "video" && myVideo && myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    }
  }, [calling, callAccepted, stream, type]);

  useEffect(() => {
    if (!chats) localStorage.setItem("chats", JSON.stringify([]));
  }, [chats]);

  useEffect(() => {
    const swap = (data) => {
      return new Promise(async (resolve, reject) => {
        const initialChats = JSON.parse(localStorage.getItem("chats"));
        if (!initialChats) return resolve([]);
        initialChats.forEach((item, i) => {
          if (item.id === data.conversationId) {
            initialChats.splice(i, 1);
            initialChats.unshift(item);
          }
        });
        localStorage.setItem("chats", JSON.stringify(initialChats));
        const chats = await setUnread(data);
        resolve(chats);
      });
    };
    const setUnread = (data) => {
      return new Promise((resolve, reject) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const chats = JSON.parse(localStorage.getItem("chats"));
        if (!chats) return resolve([]);
        const chat = chats.find((chat) => chat.id === data.conversationId);
        if (!chat) return resolve([]);
        if (data.sender.username === user.username) return resolve(chats);
        if (chatting?.id === chat?.id) return resolve(chats);
        else if (chat?.unread) chat.unread += 1;
        else chat.unread = 1;
        localStorage.setItem("chats", JSON.stringify(chats));
        resolve(chats);
      });
    };
    socket.on("newMessage", async (data) => {
      const chats = await swap(data);
      const chat = chats.find((chat) => chat.id === data.conversationId);
      if (chat) {
        chat.messages.push(data);
        chat.lastMessage = data.message;
        localStorage.setItem("chats", JSON.stringify(chats));
        setChats(chats);
      } else {
        socket.emit("getChatInfo", {
          chatId: data.conversationId,
          username: user?.username,
        });
      }
      notifyUser(data);
    });

    socket.on("chatInfo", (chat) => {
      chat.unread = 1;
      localStorage.setItem("chats", JSON.stringify([chat, ...chats]));
      setChats([chat, ...chats]);
    });

    socket.on("messageDeleted", ({ messageID, conversationID }) => {
      const chats = JSON.parse(localStorage.getItem("chats"));
      const chat = chats.find((chat) => chat.id === conversationID);
      if (!chat) return;
      const message = chat.messages.find((msg) => msg.id === messageID);
      if (!message) return;
      message.message.wasUnsent = true;
      message.message.text = null;
      localStorage.setItem("chats", JSON.stringify(chats));
      setChats(chats);
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
      const chats = JSON.parse(localStorage.getItem("chats"));
      if (chats && chats.length === 0) {
        localStorage.setItem("chats", JSON.stringify(data));
        setChats(data);
        return;
      } else {
        data.forEach((chat) => {
          const c = chats?.find((c) => c.id === chat.id);
          if (c) {
            c.unread += chat.messages.length - c.messages.length;
            c.messages = chat.messages;
            c.name = chat.name;
            c.image = chat.image;
            c.chatType = chat.chatType;
            if (c?.members) c.members = chat.members;
          } else {
            chats.push(chat);
          }
        });
        localStorage.setItem("chats", JSON.stringify(chats));
        setChats(chats);
      }
    });

    socket.on("groupMemberAdded", (data) => {
      const chats = JSON.parse(localStorage.getItem("chats"));
      const chat = chats.find((chat) => chat.id === data.id);
      if (!chat) {
        chats.push(data);
        localStorage.setItem("chats", JSON.stringify(chats));
        setChats(chats);
        return;
      }
      chat.members = data.members;
      localStorage.setItem("chats", JSON.stringify(chats));
      setChats(chats);
    });

    socket.on("groupUpdated", (data) => {
      const chats = JSON.parse(localStorage.getItem("chats"));
      const group = chats.find((chat) => chat.id === data.id);
      if (!group) {
        chats.push(data);
        localStorage.setItem("chats", JSON.stringify(chats));
        setChats(chats);
        return;
      }
      group.name = data.name;
      group.image = data.image;
      group.members = data.members;
      localStorage.setItem("chats", JSON.stringify(chats));
      setChats(chats);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("error");
      socket.off("newGroup");
      socket.off("groups");
      socket.off("chats");
      socket.off("groupMemberAdded");
    };
    // eslint-disable-next-line
  }, [chatting, user]);

  useEffect(() => {
    if (user) {
      socket.emit("userData", user);
      socket.on("connect", () => {
        socket.emit("userData", user);
      });
      if (user?.id) socket.emit("getChats", user?.username);
    }
    socket.on("tokenNotValid", () => {
      localStorage.removeItem("user");
      localStorage.setItem("chats", JSON.stringify([]));
      setUser(null);
      setChats([]);
      setChatting(null);
    });
    socket.on("userData", (data) => {
      if (!user) return;
      if (
        user.name === data.name &&
        user.image === data.image &&
        user?.id === data?.id
      )
        return;
      const updatedUser = {
        ...user,
        id: data.id,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    });
    return () => {
      socket.off("tokenNotValid");
      socket.off("userData");
      socket.off("connect");
    };
  }, [user]);

  useEffect(() => {
    socket.on("userAdded", (data) => {
      if (data.username !== user?.username) {
        const chats = JSON.parse(localStorage.getItem("chats"));
        if (chats.length === 0) {
          localStorage.setItem("chats", JSON.stringify([data]));
          setChats([data]);
        } else {
          const chat = chats.find((chat) => chat.id === data.id);
          if (!chat) {
            chats.push(data);
            localStorage.setItem("chats", JSON.stringify(chats));
            setChats(chats);
          }
        }
      }
    });
    socket.on("notFound", () => {
      alert("User not found!");
    });

    return () => {
      socket.off("userAdded");
      socket.off("notFound");
    };
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

  const setZero = (id) => {
    const chats = JSON.parse(localStorage.getItem("chats"));
    const chat = chats.find((chat) => chat.id === id);
    if (chat) {
      chat.unread = 0;
      localStorage.setItem("chats", JSON.stringify(chats));
      setChats(chats);
    }
  };

  const sendMessage = (messageData) => {
    return new Promise((resolve, reject) => {
      if (!messageData.conversationId) return reject("Error");
      if (messageData.audio) {
        const id = shortid.generate();
        const data = {
          id: id,
          conversationId: messageData.conversationId,
          sender: user?.username,
          receiver: chatting?.username,
          message: {
            id: id,
            type: "audio",
            data: messageData.audio,
          },
          time: Date.now(),
        };
        if (messageData.chatType === "group")
          socket.emit("sendGroupMessage", data);
        else socket.emit("chat", data);
        return resolve("Success");
      } else if (messageData.file) {
        const id = shortid.generate();
        let fileReader = new FileReader();
        fileReader.readAsDataURL(messageData.file);
        fileReader.onloadend = () => {
          let base64String = fileReader.result;
          const data = {
            id: id,
            conversationId: messageData.conversationId,
            sender: user?.username,
            receiver: chatting?.username,
            message: {
              id: id,
              type: messageData.file.type.split("/")[0],
              name: messageData.file.name,
              file: base64String,
              text: messageData.text,
            },
            time: Date.now(),
          };
          if (messageData.chatType === "group")
            socket.emit("sendGroupMessage", data);
          else socket.emit("chat", data);
          return resolve("Success");
        };
      } else {
        const id = shortid.generate();
        const data = {
          id: id,
          conversationId: messageData.conversationId,
          sender: user?.username,
          receiver: chatting?.username,
          message: {
            id: id,
            type: "text",
            text: messageData.text,
          },
          time: Date.now(),
        };
        if (messageData.chatType === "group")
          socket.emit("sendGroupMessage", data);
        else socket.emit("chat", data);
        return resolve("Success");
      }
    });
  };

  const addUser = (userToAdd) => {
    return new Promise((resolve) => {
      socket.emit("addingUser", { userToAdd, user: user?.username });
      return resolve("success");
    });
  };

  const callUser = (type) => {
    if (calling || caller) {
      alert("You are already on a call!");
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: type === "video" ? true : false })
        .then((stream) => {
          setStream(stream);
          setType(type);
          setCalling(true);
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
          });
          peer.on("signal", (data) => {
            const callData = {
              userToCall: chatting.username,
              userToCallName: chatting.name,
              userToCallImage: chatting.image,
              signalData: data,
              type,
              from: user?.username,
              name: user?.name,
              image: user?.image,
            };
            socket.emit("callUser", callData);
            setCalling(callData);
          });
          peer.on("stream", (stream) => {
            userStream.current.srcObject = stream;
          });
          socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
          });
          connectionRef.current = peer;
        })
        .catch(() => {
          alert("Could not start your media!");
          leaveCall();
        });
    }
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller.from });
    });
    peer.on("stream", (stream) => {
      userStream.current.srcObject = stream;
    });
    peer.signal(caller.signal);
    connectionRef.current = peer;
  };

  const ignoreCall = (user) => {
    socket.emit("ignoreCall", caller?.from || user);
    setReceivingCall(false);
    setCaller(null);
    setCallAccepted(false);
  };

  const leaveCall = () => {
    if (calling) {
      socket.emit("endCall", calling.userToCall);
    }
    if (caller) {
      socket.emit("endCall", caller.from);
    }
    setCalling(null);
    setCaller(null);
    setCallAccepted(false);
    setReceivingCall(false);
    if (connectionRef.current) {
      connectionRef.current.destroy();
      window.location.reload();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (calling) {
        if (!callAccepted) leaveCall();
      }
    }, 30000);
    return () => clearTimeout(interval);
    // eslint-disable-next-line
  }, [calling, callAccepted]);

  const muteUnmute = () => {
    setMyMicStatus((currentStatus) => {
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const updateVideo = () => {
    setMyVideoStatus((currentStatus) => {
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const handleScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((currentStream) => {
          const screenTrack = currentStream.getTracks()[0];

          connectionRef.current.replaceTrack(
            connectionRef.current.streams[0]
              .getTracks()
              .find((track) => track.kind === "video"),
            screenTrack,
            stream
          );

          screenTrack.onended = () => {
            connectionRef.current.replaceTrack(
              screenTrack,
              connectionRef.current.streams[0]
                .getTracks()
                .find((track) => track.kind === "video"),
              stream
            );

            myVideo.current.srcObject = stream;
            setScreenShare(false);
          };

          myVideo.current.srcObject = currentStream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        })
        .catch(() => {
          console.log("No stream for sharing");
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  const onPlaying = () => {
    setCurrentTime(userStream.current.currentTime);
  };

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
      username: user?.username,
    });
  };

  const createGroup = (groupData) => {
    const admin = {
      username: user?.username,
      name: user?.name,
      image: user?.image,
      admin: 1,
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
    if (data?.sender?.username === user?.username) return;
    if (data.conversationId === chatting?.id) return;
    const noti = notifications.find((n) => n.id === data.id);
    if (noti) return;
    audio.currentTime = 0;
    audio.volume = 0.045;
    const chats = JSON.parse(localStorage.getItem("chats"));
    const chat = chats.find((chat) => chat.id === data.conversationId);
    if (chat && chat.chatType === "group") {
      const notification = {
        id: data?.id,
        title: `New message from ${chat?.name}`,
        image: chat?.image,
        data,
        group: true,
      };
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    } else {
      const notification = {
        id: data?.id,
        title: `New message from ${data?.sender?.name}`,
        image: data?.sender?.image,
        data,
      };
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    }
    audio.play();
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("chats", JSON.stringify([]));
    setChats([]);
    setUser(null);
  };

  const value = {
    user,
    chats,
    setChats,
    chatting,
    setChatting,
    show,
    setUser,
    setShow,
    sendMessage,
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
    updateUser,
    callUser,
    answerCall,
    receivingCall,
    callAccepted,
    calling,
    caller,
    userStream,
    leaveCall,
    ignoreCall,
    muteUnmute,
    myMicStatus,
    onPlaying,
    currentTime,
    hide,
    setHide,
    myVideo,
    type,
    updateVideo,
    myVideoStatus,
    handleScreenSharing,
    screenShare,
    setZero,
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
    logout,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatProvider, ChatContext };
