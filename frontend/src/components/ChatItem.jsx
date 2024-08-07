import React, { useState, useEffect } from "react";
import { useMainContext } from "../context/MainContextProvider";
import { AiOutlineClose } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContextProvider";

export default function ChatItem({ chat }) {
  const { setShow, removeUser } = useMainContext();
  const { setChatting } = useChatContext();
  const [lastChat, setLastChat] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const lastChat = chat?.messages?.at(-1);
    if (lastChat?.message?.wasUnsent) setLastChat('This message was unsent');
    else if (lastChat?.message?.type === 'text') {
      if (lastChat?.message?.file) {
        setLastChat(lastChat?.message?.name);
      } else {
        setLastChat(lastChat?.message?.text);
      }
    } else if (lastChat?.message?.type === 'audio') {
      setLastChat('voice memo');
    } else if (lastChat?.message?.type === 'image') {
      setLastChat('photo');
    } else if (lastChat?.message?.type === 'application') {
      setLastChat(lastChat?.message?.name);
    } else if (lastChat?.message?.type === 'video') {
      setLastChat('video');
    }
  }, [chat.lastMessage, chat.messages]);

  const remove = (chatId, name) => {
    const sure = window.confirm(`Are you sure you want to remove ${name}?`);
    if (sure) removeUser(chatId);
  };

  return (
    <motion.li
      className="group relative cursor-pointer border-b 
      border-slate-100 px-4 py-2 backdrop-blur hover:bg-slate-700/60 active:bg-slate-600/60 dark:border-slate-500"
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      {chat.unread !== 0 && (
        <div
          className="absolute right-5 top-3 flex items-center  justify-center 
      rounded-full bg-emerald-600 px-1.5 text-white"
        >
          <p>{chat.unread}</p>
        </div>
      )}
      <div
        className="absolute right-5 top-7 hidden hover:text-red-400 group-hover:block"
        onClick={() => remove(chat.id, chat.name)}
      >
        <AiOutlineClose className="h-5 w-5" />
      </div>
      <div
        className="flex h-full select-none items-center space-x-3"
        onClick={() => {
          setChatting(chat);
          setShow(false);
          navigate(`/?id=${chat?.id}`);
          // window.history.replaceState(null, null, `?${chat?.id}`);
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
          <div className="truncate text-sm text-white">
            {lastChat === 'photo' ? (
              <div className="flex items-center gap-1">
                {chat.chatType === 'group' &&
                  chat?.messages.length > 0 &&
                  '~ ' + chat?.messages.at(-1).sender.username + ': '}
                <MdInsertPhoto fontSize={20} />
                <p>Photo</p>
              </div>
            ) : (
              <p className="truncate">
                {chat.chatType === 'group' &&
                  chat?.messages.length > 0 &&
                  '~ ' + chat?.messages.at(-1)?.sender.username + ': '}
                {''}
                {lastChat}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}
