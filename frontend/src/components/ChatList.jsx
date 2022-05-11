import React, { useContext, useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import ProfileCard from "./ProfileCard";
import { ChatContext } from "../utils/ChatContext";
import { AiOutlineSearch } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatList() {
  const { chats } = useContext(ChatContext);
  const [chatList, setChatList] = useState(chats);

  useEffect(() => {
    setChatList(chats);
  }, [chats]);

  const filterChats = (e) => {
    const filteredChats = chats.filter((user) =>
      user.name.toLowerCase().includes(e.target.value)
    );
    setChatList(filteredChats);
  };

  const focus = () => {
    const input = document.getElementById("search");
    input.focus();
  };

  return (
    <motion.div layout className="min-h-full flex-1 text-white">
      <div className="sticky top-0 z-50 bg-slate-800">
        <ProfileCard />
        <div className="mx-2 my-1 flex items-center space-x-3 rounded bg-slate-500 px-4 py-1 focus-within:bg-slate-600 hover:bg-slate-600">
          <AiOutlineSearch className="h-7 w-7" onClick={focus} />
          <input
            id="search"
            className="w-full bg-transparent outline-none placeholder:text-gray-200"
            placeholder="Search your chats"
            onChange={filterChats}
            autoComplete="off"
          />
        </div>
      </div>
      <motion.ul layout className="grid grid-cols-1 gap-0">
        <AnimatePresence>
          {chatList?.map((chat) => (
            <ChatItem chat={chat} key={chat.userName} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}
