import { useContext, useRef, useState } from "react";
import { ChatContext } from "../utils/ChatContext";
import { motion } from "framer-motion";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CreateGroupInterface() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { createGroup, createGroupChat, setCreateGroupChat, user } =
    useContext(ChatContext);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      groupName: e.target.groupName.value,
      groupImage: e.target.groupImage.value,
      members,
    };
    createGroup(data);
  };

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
          setMembers((prev) => [...prev, res.data]);
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

  const cancel = () => {
    setCreateGroupChat(false);
    setMembers([]);
    setLoading(false);
    setError(null);
    formRef.current.reset();
  };

  const variants = {
    hidden: { opacity: 0, zIndex: -1 },
    visible: { opacity: 1, zIndex: 60 },
  };
  return (
    <motion.div
      variants={variants}
      initial={createGroupChat ? "visible" : "hidden"}
      animate={createGroupChat ? "visible" : "hidden"}
      className="absolute inset-0 z-[60] bg-black/60 backdrop-blur"
    >
      <div className="flex h-full w-full items-center justify-center">
        <form
          className="flex min-h-[37rem] w-[40rem] flex-col gap-2 rounded-lg bg-gray-900 p-4 text-white"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="groupName" className="font-sans font-bold">
              Group Name
            </label>
            <input
              required
              type="text"
              name="groupName"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="groupName" className="font-sans font-bold">
              Image URL
            </label>
            <input
              required
              type="url"
              name="groupImage"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="flex grow flex-col gap-2">
            <div className="gap flex grow flex-wrap justify-center gap-2 rounded bg-white/5 p-2 backdrop-blur">
              {members.map((user) => (
                <div
                  key={user.username}
                  className="flex h-fit min-w-[8rem] flex-col items-center gap-2 rounded-lg bg-gray-700 p-2"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="aspect-square w-[55px] rounded-full object-cover"
                  />
                  <p>{user.name}</p>
                </div>
              ))}
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
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 font-serif font-bold"
                onClick={addMember}
              >
                <p>Add member</p>
                {loading && (
                  <AiOutlineLoading3Quarters className="inline-block animate-spin" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="w-full rounded bg-gradient-to-r from-orange-700 to-red-700 p-2 font-serif font-bold"
              onClick={cancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded bg-gradient-to-r from-teal-600 to-sky-600 p-2 font-serif font-bold"
            >
              Create group
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
