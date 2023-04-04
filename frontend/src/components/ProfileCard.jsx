import React, { useContext } from "react";
import { ChatContext } from "../utils/ChatContext";

export default function ProfileCard() {
  const { user, setShowProfile, addUser, setCreateGroupChat } =
    useContext(ChatContext);
  return (
    <div className="flex cursor-pointer items-center space-x-3 px-4 py-2 text-white hover:bg-slate-700 dark:bg-slate-700/60">
      <div
        className="flex grow items-center space-x-2"
        onClick={() => setShowProfile(true)}
      >
        <img
          src={user?.image}
          alt={user?.name}
          className="aspect-square h-[3.2rem] w-[3.2rem] rounded-full object-cover"
        />
        <p className="text-lg">{user?.name}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="rounded bg-gradient-to-r from-sky-500 to-indigo-500 p-2 font-bold uppercase hover:from-indigo-500 hover:to-sky-500"
          onClick={() => {
            const user = prompt("Enter username");
            addUser(user);
          }}
        >
          <p className="font-sans text-[11px]">Add a friend</p>
        </button>
        <button
          className="rounded bg-gradient-to-r from-pink-500 to-violet-500 p-2 font-bold uppercase hover:from-violet-500 hover:to-pink-500"
          onClick={() => setCreateGroupChat(true)}
        >
          <p className="font-sans text-[11px]">Create new group</p>
        </button>
      </div>
      {/* <AiOutlinePlus
        className="h-7 w-7 hover:text-gray-300"
        onClick={() => {
          const user = prompt("Enter username");
          addUser(user);
        }}
      /> */}
    </div>
  );
}
