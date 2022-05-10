import React, { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { ChatContext } from "../utils/ChatContext";

export default function ProfileCard() {
  const { name, image, setShowProfile, addUser } = useContext(ChatContext);
  return (
    <div className="flex cursor-pointer items-center space-x-3 bg-slate-700/60 px-4 py-2 text-white shadow hover:bg-slate-700">
      <div
        className="flex grow items-center space-x-2"
        onClick={() => setShowProfile(true)}
      >
        <img
          src={image}
          alt={name}
          className="aspect-square h-[3.2rem] w-[3.2rem] rounded-full object-cover"
        />
        <p className="text-lg">{name}</p>
      </div>
      <AiOutlinePlus
        className="h-7 w-7 hover:text-gray-300"
        onClick={() => {
          const user = prompt("Enter userName");
          addUser(user);
        }}
      />
    </div>
  );
}
