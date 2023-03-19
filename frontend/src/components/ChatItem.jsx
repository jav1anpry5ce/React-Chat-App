import React, { useState, useEffect, useContext } from "react";
import { ChatContext } from "../utils/ChatContext";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";
import { motion } from "framer-motion";

export default function ChatItem({ chat }) {
  const {
    setChatting,
    setShow,
    convos,
    userName,
    chatting,
    setZero,
    removeUser,
  } = useContext(ChatContext);
  const [lastChat, setLastChat] = useState("");

  useEffect(() => {
    if (convos && convos.length > 0) {
      convos.forEach((conversation, index) => {
        if (
          conversation?.users?.includes(userName) &&
          conversation?.users?.includes(chat?.userName)
        ) {
          const lastChat = convos[index]?.messages?.at(-1);
          if (lastChat?.message?.type === "text") {
            if (lastChat?.message?.file) {
              setLastChat(lastChat?.message?.name);
            } else {
              setLastChat(lastChat?.message?.text);
            }
          } else if (lastChat?.message?.type === "audio") {
            setLastChat("voice memo");
          } else if (lastChat?.message?.type === "image") {
            setLastChat("photo");
          } else if (lastChat?.message?.type === "application") {
            setLastChat(lastChat?.message?.name);
          } else if (lastChat?.message?.type === "video") {
            setLastChat("video");
          }
        }
      });
    }
  }, [convos, chat, userName]);

  useEffect(() => {
    if (chatting?.userName === chat?.userName) {
      chat.unread = 0;
      setZero(chat?.userName);
    }
    // eslint-disable-next-line
  }, [chatting, chat, setZero]);

  const remove = (userName, name) => {
    const sure = window.confirm(`Are you sure you want to remove ${name}?`);
    if (sure) removeUser(userName);
  };

  return (
    <motion.li
      className="group relative cursor-pointer border-b 
      border-slate-100 px-4 py-2 hover:bg-slate-700/60 active:bg-slate-600/60 dark:border-slate-500"
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      {chat.unread !== 0 && (
        <div
          className="absolute top-3 right-5 flex items-center  justify-center 
      rounded-full bg-emerald-600 px-1.5 text-white"
        >
          <p>{chat.unread}</p>
        </div>
      )}
      <div
        className="absolute top-7 right-1 hidden hover:text-gray-300 group-hover:block"
        onClick={() => remove(chat.userName, chat.name)}
      >
        <AiOutlineCloseCircle className="h-5 w-5" />
      </div>
      <div
        className="flex h-full select-none items-center space-x-3"
        onClick={() => {
          setChatting(chat);
          setShow(false);
          window.history.replaceState(null, null, `?${chat?.userName}`);
        }}
      >
        <div className="relative aspect-square h-[3.2rem] w-[3.2rem]">
          <img
            src={chat?.image}
            alt={chat?.name}
            className="aspect-square h-[3.2rem] w-[3.2rem] rounded-full object-cover object-center"
            draggable="false"
            loading="lazy"
          />
        </div>
        <div className="truncate">
          <h5 className="truncate font-semibold text-white">{chat?.name}</h5>
          <p className="truncate text-sm text-white">
            {lastChat === "photo" ? (
              <div className="flex items-center gap-1">
                <MdInsertPhoto fontSize={20} />
                <p>Photo</p>
              </div>
            ) : (
              lastChat
            )}
          </p>
        </div>
      </div>
    </motion.li>
  );
}
