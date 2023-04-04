import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../utils/ChatContext";
import { motion } from "framer-motion";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";

export default function ViewGroupInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { group, setGroup, addGroupMember, chats, user } =
    useContext(ChatContext);

  const addMember = (e) => {
    e.preventDefault();
    setLoading(true);
    if (e.target.parentElement.children[0].value === user.username) {
      setLoading(false);
      setError({ message: "You can't add yourself to the group" });
      return;
    }
    axios
      .get(
        `http://localhost:5000/api/users/${e.target.parentElement.children[0].value}`
      )
      .then((res) => {
        if (res.data) {
          addGroupMember(res.data.username);
          e.target.parentElement.children[0].value = "";
        }
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.response.data);
        setLoading(false);
      });
  };

  const variants = {
    hidden: { opacity: 0, zIndex: -1 },
    visible: { opacity: 1, zIndex: 60 },
  };

  useEffect(() => {
    if (group) {
      const chat = chats.find((chat) => chat.id === group.id);
      if (chat) {
        setGroup(chat);
      }
    }
  }, [chats, setGroup, group]);

  return (
    <motion.div
      variants={variants}
      initial={group ? "visible" : "hidden"}
      animate={group ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur"
    >
      <div className="relative flex aspect-square w-full max-w-2xl flex-col gap-2 rounded bg-gray-900 p-2 shadow-lg shadow-black/30">
        <button
          onClick={() => {
            setGroup(null);
            setError(null);
          }}
        >
          <AiOutlineClose
            className="absolute top-2 right-2 text-white hover:cursor-pointer hover:text-red-500"
            fontSize={26}
          />
        </button>
        <div className="flex flex-col items-center gap-2 self-center">
          <img
            src={group?.image}
            alt="profile"
            className="aspect-square w-[7rem] rounded-full object-cover object-center"
            aria-label="image"
            draggable="false"
            loading="lazy"
          />
          <p className="truncate text-3xl font-bold">{group?.name}</p>
        </div>
        <div className="flex grow flex-col gap-1">
          <p className="text-lg">{group?.members.length} Participants</p>
          <div className="grow space-y-1 rounded bg-black/30 p-2 backdrop-blur">
            {group?.members.map((member) => (
              <MemberView key={member.username} member={member} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <input
            name="username"
            placeholder="Username"
            className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
          {error && (
            <p className="ml-1 text-sm text-red-400">{error.message}</p>
          )}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 font-serif font-bold hover:from-fuchsia-500 hover:to-violet-500"
            onClick={addMember}
          >
            <p>Add member</p>
            {loading && (
              <AiOutlineLoading3Quarters className="inline-block animate-spin" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const MemberView = ({ member }) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded bg-black/20 p-0.5 px-2">
      <div className="flex items-center gap-2">
        <img
          src={member?.image}
          alt=""
          className="aspect-square w-[2.5rem] rounded-full object-cover"
        />
        <div>
          <p>{member?.name}</p>
          <p className="text-xs font-bold">{member?.username}</p>
        </div>
      </div>
      {member.admin === 1 && (
        <p className="text-xs font-bold text-green-500">Admin</p>
      )}
    </div>
  );
};
