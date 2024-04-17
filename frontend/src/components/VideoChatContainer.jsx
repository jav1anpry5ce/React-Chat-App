import { ImPhoneHangUp } from "react-icons/im";
import { useCallContext } from "../context/CallContextProvider";
import { useMainContext } from "../context/MainContextProvider";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicMuteFill,
  BsMicFill
} from "react-icons/bs";
import { MdScreenShare } from "react-icons/md";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function VideoChatContainer() {
  const {
    userStream,
    myVideo,
    onPlaying,
    myMicStatus,
    muteUnmute,
    myVideoStatus,
    updateVideo,
    handleScreenSharing,
    leaveCall
  } = useCallContext();
  const { socket } = useMainContext();
  const dragRef = useRef(null);

  return (
    <div className="m-auto h-full w-full lg:h-[65%] lg:w-[50%]">
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute inset-0 z-10 overflow-hidden">
          <video
            ref={userStream}
            autoPlay
            onTimeUpdate={onPlaying}
            playsInline
            className="h-full w-full bg-black"
          />
        </div>
        <motion.div
          ref={dragRef}
          drag
          dragConstraints={{
            top: 0,
            left: 0,
            right: dragRef.current?.offsetWidth * 2.3,
            bottom: dragRef.current?.offsetHeight * 2.3
          }}
          className="absolute left-2 top-2 z-20 h-[30%] w-[30%] cursor-grab overflow-hidden rounded lg:bottom-2 lg:right-2"
        >
          <video
            ref={myVideo}
            autoPlay
            muted
            className="h-full w-full bg-black/90"
            playsInline
          />
        </motion.div>
        <div className="absolute bottom-3 z-30 flex h-[7%] w-full items-start justify-center space-x-4">
          <div
            className="cursor-pointer rounded-full bg-red-500 px-2 py-2 text-white shadow-md hover:shadow-lg"
            onClick={() => leaveCall(socket)}
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
    </div>
  );
}
