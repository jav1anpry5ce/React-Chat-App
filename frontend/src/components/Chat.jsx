import React, { useEffect, useState, useRef } from "react";
import ChatBottom from "./ChatBottom";
import ChatHead from "./ChatHead";
import Message from "./Message";
import ViewImage from "./ViewImage";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useMainContext } from "../context/MainContextProvider";
import { useChatContext } from "../context/ChatContextProvider";
import { isToday, isYesterday } from "date-fns";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useUserContext } from "../context/UserContextProvider";
import { useCallContext } from "../context/CallContextProvider";
import { readFromDB } from '../utils/db';

function scrollToBottom() {
  const s = document.getElementById('scroll');
  s.scrollTo({
    top: s.scrollHeight - s.clientHeight,
    behavior: 'smooth'
  });
}

export default function Chat() {
  const { setShow } = useMainContext();
  const { chatting, chats, fetchMoreMessages, setChatting, setUnreadToZero } =
    useChatContext();
  const { hide } = useCallContext();
  const { user } = useUserContext();
  const [searchParams] = useSearchParams();
  const [typing, setTyping] = useState(false);
  const [bottom, setBottom] = useState(true);
  const [chat, setChat] = useState({});
  const divRef = useRef(null);

  useEffect(() => {
    const setCurrentChat = async () => {
      const chatId = searchParams.get('id') || chatting?.id;
      if (!chatId) return;
      const chat = await readFromDB(chatId);
      if (!chat) return;
      setChat(chat);
      if (!chatting) setChatting(chat);

      setTimeout(() => {
        scrollToBottom();
      }, 100);

      setTyping(false);
    };
    setCurrentChat();
    // eslint-disable-next-line
  }, [chats, chatting]);

  useEffect(() => {
    const chatId = searchParams.get('id') || chatting?.id;
    if (!chatId) return;
    setUnreadToZero(chatId);
    // eslint-disable-next-line
  }, [chatting, searchParams]);

  useEffect(() => {
    var listener;
    const s = document.getElementById('scroll');
    if (chatting) {
      listener = s.addEventListener('scroll', (e) => {
        const bottom =
          Math.round(e.target.scrollTop + e.target.clientHeight) >
          e.target.scrollHeight - 200;
        setBottom(bottom);
      });
    }
    return () => {
      if (listener) s.removeEventListener('scroll', listener);
    };
    // eslint-disable-next-line
  }, [chatting, typing]);

  useEffect(() => {
    const container = divRef.current;
    if (!container) return;

    function handleScroll() {
      const scrollTop = container.scrollTop;

      if (scrollTop === 0 && chat && chat.nextPageUrl) {
        const oldScrollHeight = container.scrollHeight;

        fetchMoreMessages(chat.nextPageUrl).then((newMessages) => {
          const updatedMessages = [...newMessages.messages, ...chat.messages];
          setChat((prevChat) => ({
            ...prevChat,
            messages: updatedMessages,
            nextPageUrl: newMessages.nextPageUrl
          }));

          setTimeout(() => {
            const newScrollHeight = container.scrollHeight;
            const scrollHeightDifference = newScrollHeight - oldScrollHeight;

            container.scrollTop += scrollHeightDifference;
          }, 0);
        });
      }
    }

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [chat, fetchMoreMessages, divRef]);

  return (
    <motion.div
      layout
      className={`h-full flex-1 bg-[url('/src/assets/background.jpg')] bg-cover bg-center ${
        hide && 'pt-5'
      } lg:pt-0`}
    >
      <ViewImage />
      <div className="flex h-full flex-col justify-between">
        {chatting ? (
          <ChatHead typing={typing} />
        ) : (
          <div className="flex items-center space-x-3 bg-emerald-500/70 px-2 py-0.5 text-white backdrop-blur-md md:hidden dark:bg-slate-800">
            <AiOutlineMenuUnfold
              className="block h-8 w-8 md:hidden"
              onClick={() => setShow(true)}
            />
          </div>
        )}
        {chatting ? (
          <>
            <div
              className="scroll relative h-full flex-1 overflow-y-auto overflow-x-hidden"
              id="scroll"
              ref={divRef}
            >
              <ul className="space-y-2 px-1 py-3 md:px-4">
                {chat?.messages?.map((item, index) => (
                  <li key={index}>
                    {new Date(item.time).toDateString() !==
                      new Date(
                        chat?.messages[index - 1]?.time
                      ).toDateString() && (
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
                    <Message
                      data={item}
                      username={user?.username}
                      chat={chat}
                    />
                  </li>
                ))}
              </ul>
              <Transition
                show={!bottom}
                className="fixed bottom-[4.5rem] 
              right-3 flex h-9 w-9
              animate-slideIn cursor-pointer items-center justify-center rounded-full bg-slate-700/80 text-white hover:bg-slate-600/80"
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
