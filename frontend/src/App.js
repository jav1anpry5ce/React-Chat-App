import { useState, useContext } from "react";
import {
  ChatList,
  Chat,
  SignUp,
  Profile,
  Call,
  ReturnCall,
} from "./components";
import noti from "./assets/noti.wav";
import { Transition } from "@headlessui/react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { ChatContext } from "./utils/ChatContext";

Notification.requestPermission();

function App() {
  const { userName, name, image, show, setShow, hide } =
    useContext(ChatContext);
  const [audio] = useState(new Audio(noti));
  if (userName && name && image)
    return (
      <div
        className="flex min-h-screen transform 
    overflow-hidden bg-gradient-to-br
    from-orange-300 to-blue-700 transition-all duration-300 dark:from-slate-900 dark:to-emerald-800"
      >
        <Call />
        <Profile />
        <ReturnCall />
        <div className="relative mx-auto flex-1">
          <div
            className={`absolute left-0 h-full overflow-y-auto bg-slate-800/70 ${
              hide && "pt-5"
            } backdrop-blur-md md:w-[35%] lg:w-[25%] lg:pt-0 xl:w-[20%]`}
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
                className={`sticky top-0 flex w-full justify-end bg-slate-900/70 ${
                  hide && "pt-5"
                } backdrop-blur-md`}
              >
                <AiOutlineMenuFold
                  className="mr-2 h-8 w-8 text-white"
                  onClick={() => setShow(false)}
                />
              </div>
              <ChatList />
            </div>
          </Transition>
          <div className="absolute top-0 right-0 h-full w-[100%] md:w-[65%] lg:w-[75%] xl:w-[80%]">
            <Chat audio={audio} />
          </div>
        </div>
      </div>
    );
  else return <SignUp />;
}

export default App;
