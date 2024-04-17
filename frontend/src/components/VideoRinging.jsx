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

export default function VideoRinging() {
  const {
    myVideo,
    myMicStatus,
    muteUnmute,
    myVideoStatus,
    updateVideo,
    handleScreenSharing,
    leaveCall
  } = useCallContext();
  const { socket } = useMainContext();
  return (
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
          onClick={() => leaveCall(socket)}
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
  );
}
