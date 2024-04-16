import React, { useRef } from "react";
import { useMainContext } from "../context/MainContextProvider";
import { useUserContext } from "../context/UserContextProvider";

export default function ProfileCard() {
  const { setShowProfile, addUser, setCreateGroupChat } = useMainContext();
  const { user } = useUserContext();
  const formRef = useRef();
  const submit = (e) => {
    e.preventDefault();
    addUser(e.target.username.value);
  };

  return (
    <>
      <dialog id="add_friend" className="modal modal-bottom sm:modal-middle">
        <form
          method="dialog"
          className="modal-box"
          onSubmit={submit}
          ref={formRef}
        >
          <button
            type="button"
            className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
            onClick={() => {
              window.add_friend.close();
              formRef.current.reset();
            }}
          >
            ✕
          </button>
          <h3 className="text-center text-xl font-bold text-white">
            Add a friend!
          </h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              required
              name="username"
              className="input-bordered input w-full"
            />
          </div>
          <button type="submit" className="btn mt-3 w-full">
            Add Friend
          </button>
        </form>
      </dialog>
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
            onClick={() => window.add_friend.showModal()}
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
      </div>
    </>
  );
}
