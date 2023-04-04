import React, { useContext, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChatContext } from "../utils/ChatContext";
import { AiOutlineClose } from "react-icons/ai";

export default function Profile() {
  const { user, showProfile, setShowProfile, updateUser } =
    useContext(ChatContext);
  const [nameInput, setNameInput] = useState();
  const [imageInput, setImageInput] = useState();

  const update = () => {
    updateUser(nameInput, imageInput);
    setNameInput("");
    setImageInput("");
  };
  return (
    <Transition.Root show={showProfile} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto"
        onClose={() => {}}
      >
        <div className="flex min-h-screen items-center justify-center px-1 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/20 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="fixed top-2 right-5 cursor-pointer bg-white transition duration-150 hover:bg-red-500 hover:text-white">
            <AiOutlineClose
              className="z-50 h-7 w-7"
              onClick={() => {
                setShowProfile(false);
              }}
            />
          </div>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block h-[30rem] w-[22rem] transform overflow-hidden 
                      rounded-lg bg-gray-900 text-left align-bottom text-white shadow-xl transition-all
                      sm:my-8 sm:w-full sm:max-w-[45rem] sm:align-middle"
            >
              <div className="flex h-full w-full flex-col items-center p-4">
                <div className="flex flex-col items-center space-y-3 text-gray-700">
                  <img
                    src={user?.image}
                    alt={user?.name}
                    className="aspect-square h-[7rem] w-[7rem] rounded-full object-cover"
                    draggable="false"
                  />
                  <p className="text-lg font-semibold text-white">
                    Username: {user?.username}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    Name: {user?.name}
                  </p>
                </div>
                <div className="flex h-full w-full flex-col items-center space-y-3">
                  <div className="w-full space-y-1">
                    <p>Name</p>
                    <input
                      className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <p>Image</p>
                    <input
                      className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-indigo-50 shadow hover:shadow-indigo-600/60 active:opacity-50"
                  onClick={update}
                >
                  Update
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
