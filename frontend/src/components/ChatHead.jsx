import { useEffect, useState } from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { MdCall } from "react-icons/md";
import { BsCameraVideoFill } from "react-icons/bs";
import { useMainContext } from "../context/MainContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContextProvider";
import { useCallContext } from "../context/CallContextProvider";

export default function ChatHead() {
  const { setShow, socket, setGroup } = useMainContext();
  const { chats, chatting, setChatting } = useChatContext();
  const { callUser } = useCallContext();
  const navigate = useNavigate();
  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chat, setChat] = useState();

  useEffect(() => {
    socket.on("online", ({ username, online }) => {
      if (username === chat?.username) {
        setOnline(online);
      }
    });
    socket.on("usertyping", (data) => {
      if (chat) {
        if (data.typing === chat.username) {
          if (!typing) setTyping(true);
        } else {
          if (typing) setTyping(false);
        }
      }
    });
    socket.on("newMessage", (data) => {
      if (data.sender?.username === chat?.username) setTyping(false);
    });
    return () => {
      socket.off("online");
      socket.off("usertyping");
    };
    // eslint-disable-next-line
  }, [chat]);

  useEffect(() => {
    setTimeout(() => {
      if (typing) setTyping(false);
    }, 2500);
  }, [typing]);

  useEffect(() => {
    const chat = chats.find((chat) => chat.id === chatting?.id);
    setChat(chat);
  }, [chats, chatting]);

  const viewGroup = () => {
    if (chatting.chatType === "group") setGroup(chatting);
  };

  return (
    <motion.div
      layout
      className="flex select-none items-center space-x-3 bg-slate-600/70 px-2 py-0.5 text-white backdrop-blur-md dark:bg-slate-800"
    >
      <div className="group flex grow items-center space-x-3">
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
              navigate("/");
            }}
          />
          <img
            src={chat?.image}
            alt="profile"
            className="aspect-square h-[2.3rem] w-[2.3rem] rounded-full object-cover object-center transition duration-300 md:h-[3.2rem] md:w-[3.2rem]"
            aria-label="image"
            draggable="false"
            loading="lazy"
          />
        </div>
        <div onClick={viewGroup} className="cursor-pointer">
          <p className="font-semibold text-white transition duration-300 hover:text-gray-400">
            {chat?.name}
          </p>
          <AnimatePresence>
            {typing && (
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
        </div>
      </div>
      {chat?.chatType !== "group" && (
        <div className="flex items-center space-x-6 pr-4">
          <MdCall
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            onClick={() => callUser("audio", socket)}
          />
          <BsCameraVideoFill
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            onClick={() => callUser("video", socket)}
          />
        </div>
      )}
    </motion.div>
  );
}
