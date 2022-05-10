import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
const shortid = require("shortid");
const ip = "https://javaughnpryce.live:5000";

const ChatContext = createContext();

const socket = io(ip);

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(
    JSON.parse(localStorage.getItem("chats")) || []
  );
  const [chatting, setChatting] = useState();
  const userName = localStorage.getItem("username");
  const [name, setName] = useState(localStorage.getItem("name"));
  const [image, setImage] = useState(
    localStorage.getItem("image") ||
      "https://i1.sndcdn.com/avatars-000196113278-93p2dw-t500x500.jpg"
  );
  const [show, setShow] = useState(false);
  const [conversationId, setConversationId] = useState();
  const [viewing, setViewing] = useState(false);
  const [viewSrc, setViewSrc] = useState(null);
  const [convos, setConvos] = useState(
    JSON.parse(localStorage.getItem("conversation")) || []
  );
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

  const myVideo = useRef();
  const userStream = useRef();
  const connectionRef = useRef();
  const screenTrackRef = useRef();

  useEffect(() => {
    socket.on("callUser", (data) => {
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
    const getChats = () => {
      if (chats && chats.length > 0) {
        chats.forEach((chat) => {
          const data = {
            sender: userName,
            receiver: chat?.userName,
          };
          socket.emit("getMyChats", data);
        });
      }
    };
    const userChanged = () => {
      if (chats && chats.length > 0) {
        chats.forEach((chat) => {
          socket.emit("userChanged", chat.userName);
        });
      }
    };
    if (!chats) {
      localStorage.setItem("chats", JSON.stringify([]));
    }
    const data = {
      name,
      image,
      userName,
    };
    getChats();
    socket.on("connect", () => {
      if (userName && name && image) socket.emit("userData", data);
      getChats();
      userChanged();
    });
  }, [userName, name, image, chats]);

  useEffect(() => {
    const swap = (data) => {
      chats.forEach((item, i) => {
        if (item.userName === data.receiver) {
          chats.splice(i, 1);
          chats.unshift(item);
        } else if (item.userName === data.sender) {
          chats.splice(i, 1);
          chats.unshift(item);
        }
      });
      localStorage.removeItem("chats");
      localStorage.setItem("chats", JSON.stringify(chats));
    };
    const setUnread = (data) => {
      const chat = chats.find((u) => u.userName === data.sender);
      if (chat) {
        if (chat?.unread) chat.unread += 1;
        else chat.unread = 1;
      }
    };
    localStorage.setItem("conversation", JSON.stringify([]));
    socket.on("newMessage", (data) => {
      const conversations = JSON.parse(localStorage.getItem("conversation"));
      const conversation = conversations.find(
        (con) => con.id === data.conversationId
      );
      if (conversation) {
        swap(data);
        setUnread(data);
        const update = conversation.messages.concat(data);
        const index = conversations.findIndex(
          (con) => con.id === data.conversationId
        );
        conversations[index].messages = update;
        setConvos(conversations);
        const newData = JSON.stringify(conversations);
        localStorage.setItem("conversation", newData);
      } else {
        addUser(data.sender).then(() => {
          swap(data);
          setUnread(data);
        });
      }
    });
    socket.on("yourChats", (data) => {
      const oldConversations = JSON.parse(localStorage.getItem("conversation"));
      const conversation = data;
      if (oldConversations) {
        if (!oldConversations.find((con) => con.id === conversation[0].id)) {
          const newConversation = oldConversations.concat(conversation[0]);
          localStorage.setItem("conversation", JSON.stringify(newConversation));
          setConvos(newConversation);
        }
      } else {
        localStorage.setItem("conversation", JSON.stringify(conversation));
        setConvos(conversation);
      }
    });

    socket.on("stuffChanged", ({ user, name, image }) => {
      try {
        const arr = chats;
        const u = arr.find((u) => u.userName === user);
        if (u) {
          console.log(u);
          u.name = name;
          u.image = image;
          localStorage.setItem("chats", JSON.stringify(arr));
          setChats((chats) => [...chats, arr]);
          setChats(arr);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("userChanged", (data) => {
      try {
        const arr = chats;
        const chat = arr.find((chat) => chat.userName === data.userName);
        if (chat) {
          chat.name = data.name;
          chat.image = data.image;
          localStorage.setItem("chats", JSON.stringify(arr));
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("stuffChanged");
      socket.off("userChanged");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("userAdded", (data) => {
      if (data.userName !== userName) {
        const chat = chats.find((u) => u.userName === data.userName);
        if (!chat) {
          setChats((chats) => [...chats, data]);
        }
      }
    });
    socket.on("notFound", () => {
      alert("User not found!");
    });
    socket.on("updated", ({ name, image }) => {
      setName(name);
      localStorage.setItem("name", name);
      setImage(image);
      localStorage.setItem("image", image);
      chats.forEach((chat) => {
        socket.emit("stuffChanged", {
          user: chat.userName,
          me: userName,
          name,
          image,
        });
      });
    });

    if (chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(chats));
      setInterval(() => {
        chats.forEach((chat) => {
          socket.emit("online", chat.userName);
        });
      }, 100);
    }
    return () => {
      socket.off("userAdded");
      socket.off("notFound");
      socket.off("online");
      socket.off("updated");
    };
  }, [userName, chats]);

  const setZero = (userName) => {
    const chat = chats.find((u) => u.userName === userName);
    if (chat) {
      chat.unread = 0;
      const newArray = [chat];
      const newChats = chats.filter((u) => u.userName !== chat.userName);
      newChats.forEach((chat) => {
        newArray.push(chat);
      });
      localStorage.setItem("chats", JSON.stringify(newArray));
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
          sender: userName,
          receiver: chatting?.userName,
          message: {
            id: id,
            type: "audio",
            data: messageData.audio,
          },
          time: Date.now(),
        };
        socket.emit("chat", data);
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
            sender: userName,
            receiver: chatting?.userName,
            message: {
              id: id,
              type: messageData.file.type.split("/")[0],
              name: messageData.file.name,
              file: base64String,
              text: messageData.text,
            },
            time: Date.now(),
          };
          socket.emit("chat", data);
          return resolve("Success");
        };
      } else {
        const id = shortid.generate();
        const data = {
          id: id,
          conversationId: messageData.conversationId,
          sender: userName,
          receiver: chatting?.userName,
          message: {
            id: id,
            type: "text",
            text: messageData.text,
          },
          time: Date.now(),
        };
        socket.emit("chat", data);
        return resolve("Success");
      }
    });
  };

  const addUser = (user) => {
    return new Promise((resolve) => {
      socket.emit("addingUser", user);
      return resolve("success");
    });
  };

  const updateUser = (newName, newImage) => {
    if (newName || newImage) {
      socket.emit("updateMe", {
        userName,
        name: newName ? newName : name,
        image: newImage ? newImage : image,
      });
    }
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
              userToCall: chatting.userName,
              userToCallName: chatting.name,
              userToCallImage: chatting.image,
              signalData: data,
              type,
              from: userName,
              name: name,
              image: image,
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

  const removeUser = (user) => {
    if (chatting && chatting.userName === user) setChatting(null);
    const newChats = chats.filter((chat) => chat.userName !== user);
    const conversation = convos.find(
      (con) => con.users.includes(user) && con.users.includes(userName)
    );
    const newConvos = convos.filter((con) => con.id !== conversation.id);
    setChats(newChats);
    setConvos(newConvos);
    localStorage.setItem("conversation", JSON.stringify(newConvos));
    localStorage.setItem("chats", JSON.stringify(newChats));
  };

  const value = {
    chats,
    setChats,
    chatting,
    setChatting,
    userName,
    name,
    image,
    show,
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
    convos,
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatProvider, ChatContext };
