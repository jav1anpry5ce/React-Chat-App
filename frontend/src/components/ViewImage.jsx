import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMainContext } from "../context/MainContextProvider";
import { AiOutlineClose } from "react-icons/ai";

export default function ViewImage() {
  const { viewing, setViewing, viewSrc } = useMainContext();
  return (
    <Transition.Root show={viewing} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto"
        onClose={() => {
          setViewing(false);
        }}
      >
        <div className="flex min-h-screen items-center justify-center text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

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
              className="inline-block h-auto w-auto 
            transform select-none overflow-hidden rounded-lg px-2 text-left
            align-bottom shadow-xl transition-all sm:my-8 sm:align-middle"
            >
              <img
                src={viewSrc}
                alt="photoViewed"
                className="max-h-[43rem] rounded object-cover object-center transition-all duration-200"
              />
            </div>
          </Transition.Child>
          <div className="fixed right-5 top-2 bg-white transition duration-150 hover:bg-red-500 hover:text-white">
            <AiOutlineClose
              className="h-7 w-7 cursor-pointer"
              onClick={() => {
                setViewing(false);
              }}
            />
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
