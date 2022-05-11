import React, { useEffect, useState, useContext, Fragment } from "react";
import ChatBottom from "./ChatBottom";
import ChatHead from "./ChatHead";
import Message from "./Message";
import ViewImage from "./ViewImage";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BsChevronDoubleDown } from "react-icons/bs";
import { ChatContext } from "../utils/ChatContext";
import { isToday, isYesterday } from "date-fns";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";

function showNotification(head, body) {
  if (body.type === "text") {
    new Notification(head, {
      body: body.text,
      silent: true,
    });
  } else {
    new Notification(head, {
      body: body.type,
      data: body.text,
      silent: true,
    });
  }
}

function scrollToBottom() {
  const s = document.getElementById("scroll");
  s.scrollTo({
    top: s.scrollHeight - s.clientHeight,
    behavior: "smooth",
  });
}

export default function Chat({ audio }) {
  const {
    socket,
    chatting,
    userName,
    setShow,
    chats,
    convos,
    hide,
    setChatting,
    setConversationId,
  } = useContext(ChatContext);
  const [typing, setTyping] = useState(false);
  const [bottom, setBottom] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userName && convos && chatting) {
      const conversation = convos.find(
        (conversation) =>
          conversation.users?.includes(userName) &&
          conversation.users?.includes(chatting.userName)
      );
      if (conversation) {
        setMessages(conversation?.messages);
        setConversationId(conversation?.id);
      }
    }
    // eslint-disable-next-line
  }, [convos, chatting, userName]);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      setTimeout(() => {
        scrollToBottom();
      }, 300);
      if (data) {
        setTyping(false);
        if (data.receiver === userName) {
          const name = chats.find(
            (user) => user?.userName === data.sender
          )?.name;
          showNotification(
            `New message from ${name ? name : data.sender}`,
            data.message
          );
          if (audio.paused || audio.currentTime > 0) {
            audio.currentTime = 0;
            audio.volume = 0.045;
            audio.play();
          } else {
            audio.volume = 0.045;
            audio.play();
          }
        }
      }
    });
    return () => socket.off("newMessage");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (typing) setTyping(false);
    }, 5000);
  }, [typing]);

  useEffect(() => {
    if (chatting) {
      const s = document.getElementById("scroll");
      setTimeout(() => {
        scrollToBottom();
      }, 700);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
      s.addEventListener("scroll", (e) => {
        const bottom =
          Math.round(e.target.scrollTop + e.target.clientHeight) >
          e.target.scrollHeight - 200;
        setBottom(bottom);
      });
    }
    socket.on("usertyping", (data) => {
      if (chatting) {
        if (data.typing === chatting.userName) {
          if (!typing) setTyping(true);
        } else {
          if (typing) setTyping(false);
        }
      }
    });
    return () => socket.off("usertyping");
    // eslint-disable-next-line
  }, [chatting, typing]);

  useEffect(() => {
    const chatting = window.location.search.split("?")[1];
    const chat = chats.find((u) => u.userName === chatting);
    if (chat) {
      setTimeout(() => {
        setChatting(chat);
      }, 500);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div
      layout
      className={`h-full flex-1 bg-[url('/src/assets/background.jpg')] bg-cover bg-center ${
        hide && "pt-5"
      } lg:pt-0`}
    >
      <ViewImage />
      <div className="flex h-full flex-col justify-between">
        {chatting ? (
          <ChatHead typing={typing} />
        ) : (
          <div className="flex items-center space-x-3 bg-emerald-500/70 px-2 py-0.5 text-white backdrop-blur-md dark:bg-slate-800 md:hidden">
            <AiOutlineMenuUnfold
              className="block h-8 w-8 md:hidden"
              onClick={() => setShow(true)}
            />
          </div>
        )}
        {chatting ? (
          <>
            <div
              className="relative h-full flex-1 overflow-y-auto overflow-x-hidden"
              id="scroll"
            >
              <div className="space-y-2 px-4 py-3">
                {messages?.map((item, index) => (
                  <div key={index}>
                    {new Date(item.time).toDateString() !==
                      new Date(messages[index - 1]?.time).toDateString() && (
                      <div className="top-1 z-50 flex w-full justify-center pb-3 md:sticky">
                        <p className="rounded-full bg-slate-800 px-6 text-center text-white">
                          {isToday(new Date(item.time)) ? (
                            <span>Today</span>
                          ) : isYesterday(new Date(item.time)) ? (
                            <span>Yesterday</span>
                          ) : (
                            new Date(item.time).toDateString()
                          )}
                        </p>
                      </div>
                    )}
                    <Message data={item} userName={userName} />
                  </div>
                ))}
              </div>
              <Transition
                show={!bottom}
                className="animate-slideIn fixed 
              right-3 bottom-[4.5rem] flex h-9
              w-9 cursor-pointer items-center justify-center rounded-full bg-slate-700/80 text-white hover:bg-slate-600/80"
                leave="transition transform duration-700"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-[300%]"
                onClick={scrollToBottom}
              >
                <BsChevronDoubleDown className="mt-0.5 h-6 w-6" />
              </Transition>
            </div>
            <ChatBottom />
          </>
        ) : (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="rounded-full bg-slate-800 px-4 py-1 text-white">
              Start chatting with someone!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
