import { useState, useContext } from "react";
import {
  ChatList,
  Chat,
  Profile,
  Call,
  ReturnCall,
  CreateGroupInterface,
  ViewGroupInfo,
  Notifications,
} from "../components";
import noti from "../assets/noti.wav";
import { Transition } from "@headlessui/react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { ChatContext } from "../utils/ChatContext";
import { Navigate } from "react-router-dom";

Notification.requestPermission();

function App() {
  const { show, setShow, hide, user } = useContext(ChatContext);
  const [audio] = useState(new Audio(noti));
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex h-screen flex-col">
      {isOpen && (
        <div className="flex items-center bg-slate-600 p-1">
          <p className="grow text-center text-sm font-medium text-gray-100 md:text-xl">
            Server is currently offline. This project source code can be
            access&nbsp;
            <a
              href="https://github.com/jav1anpry5ce/React-Chat-App"
              className="underline"
            >
              here
            </a>
          </p>
          <button
            className="text-3xl text-gray-100 hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
        </div>
      )}

      <div
        className="flex flex-1 
    transform overflow-hidden
    bg-gradient-to-br from-orange-300 to-blue-700 transition-all duration-300 dark:from-slate-900 dark:to-emerald-800"
      >
        <Call />
        <Profile />
        <ReturnCall />
        <CreateGroupInterface />
        <ViewGroupInfo />
        <Notifications />
        <div className="relative mx-auto flex-1">
          <div
            className={`scroll absolute left-0 h-full overflow-y-auto bg-slate-800/70 ${
              hide && "pt-5"
            } backdrop-blur-md md:w-[35%] lg:w-[30%] lg:pt-0 xl:w-[25%]`}
          >
            <ChatList />
          </div>
          <Transition
            show={show}
            className="absolute left-0 z-10 h-full w-[100%] overflow-y-auto bg-slate-800/70 backdrop-blur-lg md:hidden"
            enter="transition transform duration-700"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition transform duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <div>
              <div
                className={`scroll sticky top-0 z-50 flex w-full justify-end bg-slate-900/70 ${
                  hide && "pt-5"
                } backdrop-blur`}
              >
                <AiOutlineMenuFold
                  className="mr-2 h-8 w-8 text-white"
                  onClick={() => setShow(false)}
                />
              </div>
              <ChatList />
            </div>
          </Transition>
          <div className="absolute top-0 right-0 h-full w-[100%] md:w-[65%] lg:w-[70%] xl:w-[75%]">
            <Chat audio={audio} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
