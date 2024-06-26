import {
  ChatList,
  Chat,
  Profile,
  Call,
  ReturnCall,
  CreateGroupInterface,
  ViewGroupInfo,
  Notifications
} from "../components";
import { Transition } from "@headlessui/react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { useMainContext } from "../context/MainContextProvider";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContextProvider";
import { useCallContext } from "../context/CallContextProvider";

function App() {
  const { show, setShow } = useMainContext();
  const { user } = useUserContext();
  const { hide } = useCallContext();

  if (!user || Object.keys(user).length === 0) return <Navigate to="/login" />;
  return (
    <main className="flex max-h-screen flex-col bg-slate-800 supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]">
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
                className={`scroll sticky top-0 z-50 flex w-full justify-end bg-slate-800/70 ${
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
          <div className="absolute right-0 top-0 h-full w-[100%] md:w-[65%] lg:w-[70%] xl:w-[75%]">
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
