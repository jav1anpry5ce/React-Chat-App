import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { MdCall } from "react-icons/md";
import { BsCameraVideoFill } from "react-icons/bs";
import { ChatContext } from "../utils/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatHead({ typing }) {
  const { chatting, setShow, setChatting, callUser, socket, setGroup } =
    useContext(ChatContext);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    setOnline(false);
    socket.on("online", ({ username, online }) => {
      if (username === chatting?.username) {
        setOnline(online);
      }
    });
    return () => socket.off("online");
    // eslint-disable-next-line
  }, [chatting]);

  const viewGroup = () => {
    if (chatting.chatType === "group") setGroup(chatting);
  };

  return (
    <motion.div
      layout
      className="flex select-none items-center space-x-3 bg-slate-600/70 px-2 py-0.5 text-white backdrop-blur-md dark:bg-slate-800"
    >
      <div
        className="group flex grow items-center space-x-3 hover:cursor-pointer"
        onClick={viewGroup}
      >
        <div className="flex items-center space-x-2">
          <AiOutlineMenuUnfold
            className="block h-8 w-8 md:hidden"
            onClick={() => setShow(true)}
            aria-label="Swipe back"
          />
          <BiArrowBack
            className="hidden h-5 w-5 cursor-pointer hover:text-[#f25b50] active:text-[#f25b50]/70 md:block"
            aria-label="close"
            onClick={() => {
              setChatting(null);
              window.history.replaceState(null, null, "?null");
            }}
          />
          <img
            src={chatting?.image}
            alt="profile"
            className="aspect-square h-[2.3rem] w-[2.3rem] rounded-full object-cover object-center transition duration-300 group-hover:opacity-70 md:h-[3.2rem] md:w-[3.2rem]"
            aria-label="image"
            draggable="false"
            loading="lazy"
          />
        </div>
        <motion.div layout>
          <motion.h5
            layout="position"
            className="font-semibold text-white transition duration-300 group-hover:text-gray-400"
          >
            {chatting?.name}
          </motion.h5>
          <AnimatePresence>
            {typing && online && (
              <motion.p
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white"
              >
                typing...
              </motion.p>
            )}
            {online && !typing && (
              <motion.p
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white"
              >
                online
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {chatting.chatType !== "group" && (
        <div className="flex items-center space-x-6 pr-4">
          <MdCall
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            onClick={() => callUser("audio")}
          />
          <BsCameraVideoFill
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            onClick={() => callUser("video")}
          />
        </div>
      )}
    </motion.div>
  );
}
