import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getData, storeData } from "../utils/storage";
const IP = `http://api.chatapp.home`;
const shortid = require("shortid");
const socket = io(IP);

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [chatting, setChatting] = useState();
  const [tabName, setTabName] = useState("Chats");

  useEffect(() => {
    getData("user").then((user) => {
      if (user) {
        setUser(user);
      }
    });
    getData("chats").then((chats) => {
      if (chats) {
        setChats(chats);
      } else {
        storeData("chats", []);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("userData", user);
      socket.emit("getChats", user?.username);
    }
    socket.on("connect", () => {
      socket.emit("userData", user);
    });
  }, [user]);

  useEffect(() => {
    socket.on("chats", async (data) => {
      const chats = await getData("chats");
      if (chats && chats.length === 0) {
        await storeData("chats", data);
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
            c.lastMessage = chat.lastMessage;
            if (c?.members) c.members = chat.members;
          } else {
            chats.push(chat);
          }
        });
        setChats(chats);
        await storeData("chats", chats);
      }
    });
    socket.on("newMessage", async (data) => {
      const chats = await swap(data);
      const chat = chats.find((chat) => chat.id === data.conversationId);
      if (chat) {
        chat.messages.push(data);
        chat.lastMessage = data.message;
        await storeData("chats", chats);
        setChats(chats);
      } else {
        socket.emit("getChatInfo", {
          chatId: data.conversationId,
          username: user?.username,
        });
      }
      //   notifyUser(data);
    });

    socket.on("messageDeleted", async ({ messageID, conversationID }) => {
      const chats = await getData("chats");
      const chat = chats.find((chat) => chat.id === conversationID);
      if (!chat) return;
      const message = chat.messages.find((msg) => msg.id === messageID);
      if (!message) return;
      message.message.wasUnsent = true;
      message.message.text = null;
      setChats(chats);
      await storeData("chats", chats);
    });

    return () => {
      socket.off("chats");
      socket.off("messageDeleted");
    };
  }, []);

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

  const swap = (data) => {
    return new Promise(async (resolve, reject) => {
      const initialChats = await getData("chats");
      if (!initialChats) return resolve([]);
      initialChats.forEach((item, i) => {
        if (item.id === data.conversationId) {
          initialChats.splice(i, 1);
          initialChats.unshift(item);
        }
      });
      await storeData("chats", initialChats);
      const chats = await setUnread(data);
      resolve(chats);
    });
  };
  const setUnread = (data) => {
    return new Promise(async (resolve, _) => {
      const user = await getData("user");
      const chats = await getData("chats");
      if (!chats) return resolve([]);
      const chat = chats.find((chat) => chat.id === data.conversationId);
      if (!chat) return resolve([]);
      if (data.sender.username === user.username) return resolve(chats);
      if (chatting?.id === chat?.id) return resolve(chats);
      else if (chat?.unread) chat.unread += 1;
      else chat.unread = 1;
      await storeData("chats", chats);
      resolve(chats);
    });
  };
  function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }
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
        toDataUrl(messageData.file.uri, (base) => {
          const data = {
            id: id,
            conversationId: messageData.conversationId,
            sender: user?.username,
            receiver: chatting?.username,
            message: {
              id: id,
              type: messageData.file.type,
              name: messageData.file.fileName,
              file: base,
              text: messageData.text,
            },
            time: Date.now(),
          };
          if (messageData.chatType === "group")
            socket.emit("sendGroupMessage", data);
          else socket.emit("chat", data);
          return resolve("Success");
        });
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
  const setZero = async (id) => {
    const chat = chats.find((chat) => chat.id === id);
    if (chat) {
      chat.unread = 0;
      setChats(chats);
      await storeData("chats", chats);
    }
  };
  const logout = async () => {
    await storeData("user", null);
    await storeData("chats", []);
    setUser(null);
    setChats([]);
  };

  const value = {
    user,
    setUser,
    chats,
    chatting,
    setChatting,
    sendMessage,
    setZero,
    logout,
    tabName,
    setTabName,
    socket,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };
