import React, { Fragment, useContext, useState, useEffect } from "react";
import { ChatContext } from "../utils/ChatContext";
import { Dialog, Transition } from "@headlessui/react";
import { ImPhoneHangUp } from "react-icons/im";
import ring from "../assets/ring.mp3";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicMuteFill,
  BsFillTelephoneFill,
  BsMicFill,
} from "react-icons/bs";
import { MdScreenShare } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

const format = require("format-duration");

export default function Call() {
  const {
    calling,
    answerCall,
    callAccepted,
    receivingCall,
    caller,
    leaveCall,
    ignoreCall,
    myMicStatus,
    muteUnmute,
    onPlaying,
    currentTime,
    hide,
    setHide,
    myVideo,
    type,
    userStream,
    updateVideo,
    myVideoStatus,
    handleScreenSharing,
  } = useContext(ChatContext);
  const [show, setShow] = useState(false);
  const [audio] = useState(new Audio(ring));

  useEffect(() => {
    if (calling) {
      setShow(true);
    } else if (receivingCall) {
      setShow(true);
      audio.currentTime = 0;
      audio.volume = 0.045;
      audio.loop = true;
      audio.play();
    } else {
      setShow(false);
    }
    if (callAccepted) audio.pause();
    if (!receivingCall) audio.pause();
  }, [receivingCall, calling, audio, callAccepted]);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 overflow-y-auto ${hide && "-z-20"} px-2`}
        onClose={() => {}}
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
            <Dialog.Overlay className="fixed inset-0 bg-black/60 bg-opacity-75 transition-opacity" />
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
            {receivingCall && !callAccepted ? (
              <div className="inline-block h-[18rem] w-full transform overflow-hidden rounded-lg bg-gray-900 text-left align-bottom text-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[30rem] sm:align-middle">
                <div className="flex h-full flex-col items-center justify-between bg-gray-900 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <p className="text-lg font-semibold">
                    You are receiving a call
                  </p>
                  <div className="flex w-full justify-between space-x-6 px-6">
                    <div className="mx-auto flex max-w-xl items-center space-x-4">
                      <img
                        src={caller?.image}
                        alt={caller?.name}
                        className="aspect-square h-16 w-16 rounded-full object-cover"
                      />
                      <p className="text-lg font-semibold">{caller?.name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-20">
                    <div
                      className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white"
                      onClick={ignoreCall}
                    >
                      <ImPhoneHangUp className="h-8 w-8" />
                    </div>
                    <div
                      className="cursor-pointer rounded-full bg-green-600 px-2 py-2 text-white"
                      onClick={answerCall}
                    >
                      <BsFillTelephoneFill className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ) : type === "video" ? (
              <div
                className="inline-block h-full w-full 
              transform overflow-hidden rounded-lg text-left
              align-bottom shadow-xl transition-all sm:align-middle"
              >
                <div className="flex items-center justify-center space-x-0.5">
                  {callAccepted ? (
                    <div className="relative flex h-screen w-full items-center justify-center">
                      <div className="flex h-screen flex-col items-center justify-center space-y-1.5">
                        <div className="h-auto md:w-[53rem]">
                          <video
                            ref={userStream}
                            autoPlay
                            className="w-full rounded"
                            onTimeUpdate={onPlaying}
                            playsInline
                          />
                        </div>
                        <motion.div
                          drag
                          dragConstraints={{
                            top: Math.round(-(window.innerHeight / 1.3)),
                            left: Math.round(-(window.innerWidth / 1.2)),
                            right: 0,
                            bottom: 0,
                          }}
                          className="z-30 h-auto cursor-move md:absolute md:bottom-0 md:right-0 md:w-[15rem]"
                        >
                          <video
                            ref={myVideo}
                            autoPlay
                            muted
                            className="w-full rounded"
                            playsInline
                          />
                        </motion.div>
                      </div>
                      <div className="absolute bottom-1 z-50 flex w-full items-center justify-center space-x-4">
                        <div
                          className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                          onClick={leaveCall}
                        >
                          <ImPhoneHangUp className="h-8 w-8" />
                        </div>
                        {myMicStatus ? (
                          <div
                            className="cursor-pointer rounded-full bg-white px-2 py-2 shadow-md hover:shadow-lg"
                            onClick={muteUnmute}
                          >
                            <BsMicFill className="h-8 w-8" />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                            onClick={muteUnmute}
                          >
                            <BsFillMicMuteFill className="h-8 w-8" />
                          </div>
                        )}
                        {myVideoStatus ? (
                          <div
                            className="cursor-pointer rounded-full bg-gray-100 px-2 py-2 shadow-md hover:shadow-lg"
                            onClick={updateVideo}
                          >
                            <BsCameraVideoFill className="h-8 w-8" />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                            onClick={updateVideo}
                          >
                            <BsCameraVideoOffFill className="h-8 w-8" />
                          </div>
                        )}
                        <div
                          className="cursor-pointer rounded-full bg-gray-100 px-2 py-2 shadow-md hover:shadow-lg"
                          onClick={handleScreenSharing}
                        >
                          <MdScreenShare className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        ref={myVideo}
                        autoPlay
                        muted
                        className="aspect-auto h-auto w-[40rem] rounded"
                        playsInline
                      />
                      <div className="absolute bottom-0 z-10 flex w-full items-center justify-center space-x-8 px-4 py-2">
                        <div
                          className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                          onClick={leaveCall}
                        >
                          <ImPhoneHangUp className="h-8 w-8" />
                        </div>
                        {myMicStatus ? (
                          <div
                            className="cursor-pointer rounded-full bg-green-500 px-2 py-2 shadow-md hover:shadow-lg"
                            onClick={muteUnmute}
                          >
                            <BsMicFill className="h-8 w-8" />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                            onClick={muteUnmute}
                          >
                            <BsFillMicMuteFill className="h-8 w-8" />
                          </div>
                        )}
                        {myVideoStatus ? (
                          <div
                            className="cursor-pointer rounded-full bg-gray-100 px-2 py-2 shadow-md hover:shadow-lg"
                            onClick={updateVideo}
                          >
                            <BsCameraVideoFill className="h-8 w-8" />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                            onClick={updateVideo}
                          >
                            <BsCameraVideoOffFill className="h-8 w-8" />
                          </div>
                        )}
                        <div
                          className="cursor-pointer rounded-full bg-gray-100 px-2 py-2 shadow-md hover:shadow-lg"
                          onClick={handleScreenSharing}
                        >
                          <MdScreenShare className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="inline-block h-[30rem] w-full transform overflow-hidden rounded-lg bg-gray-900 text-left align-bottom text-white shadow-xl transition-all sm:my-8 sm:max-w-sm sm:align-middle">
                <div className="flex h-full flex-col items-center bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  {callAccepted && (
                    <audio ref={userStream} autoPlay onTimeUpdate={onPlaying} />
                  )}
                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-center text-lg font-semibold">
                      {calling?.userToCallName || caller?.name}
                    </p>
                    {callAccepted ? (
                      <p className="text-center text-lg">
                        {format(currentTime * 1000)}
                      </p>
                    ) : (
                      <p className="text-center text-lg">Ringing...</p>
                    )}
                  </div>
                  <div className="flex grow items-center">
                    <img
                      src={calling?.userToCallImage || caller?.image}
                      alt="Chatting"
                      className="aspect-square h-36 w-36 rounded-full object-cover"
                      draggable="false"
                    />
                  </div>
                  <div className="flex w-full justify-between space-x-6 px-6">
                    <div
                      className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                      onClick={leaveCall}
                    >
                      <ImPhoneHangUp className="h-8 w-8" />
                    </div>
                    {myMicStatus ? (
                      <div
                        className="cursor-pointer rounded-full bg-green-500 px-2 py-2 shadow-md hover:shadow-lg"
                        onClick={muteUnmute}
                      >
                        <BsMicFill className="h-8 w-8" />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
                        onClick={muteUnmute}
                      >
                        <BsFillMicMuteFill className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Transition.Child>
          <div className="group fixed right-5 top-2 cursor-pointer bg-white transition duration-150 hover:bg-red-500 hover:text-white">
            <AiOutlineClose
              className="h-6 w-6"
              onClick={() => {
                setHide(!hide);
              }}
            />
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
