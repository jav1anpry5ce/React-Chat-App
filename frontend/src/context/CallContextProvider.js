import { createContext, useContext, useState, useRef } from "react";
import { useUserContext } from "./UserContextProvider";
import { useChatContext } from "./ChatContextProvider";
import Peer from "simple-peer";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user } = useUserContext();
  const { chatting } = useChatContext();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [calling, setCalling] = useState(null);
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [myVideoStatus, setMyVideoStatus] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [type, setType] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [hide, setHide] = useState(false);
  const [callerStream, setCallerStream] = useState();

  const connectionRef = useRef(null);
  const screenTrackRef = useRef(null);

  const callUser = async (data, socket) => {
    const stream = await getUserMedia(data);
    constructPeer(socket, data, stream);
    setStream(stream);
    setCalling(true);
  };

  const setupIncomingCall = async (data, socket) => {
    if (calling || caller) {
      socket.emit("busy", data.from);
      return;
    }
    const userStream = await getUserMedia(data.type);
    setStream(userStream);
    setReceivingCall(true);
    setCaller(data);
  };

  const answerCall = (socket) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller.from });
    });

    peer.on("stream", (stream) => {
      setCallerStream(stream);
    });

    peer.signal(caller.signal);
    setCallAccepted(true);
    connectionRef.current = peer;
    startTimer();
  };

  const ignoreCall = (user, socket) => {
    socket.emit("ignoreCall", caller?.from || user);
    resetCall();
  };

  const leaveCall = (socket) => {
    if (calling) {
      socket.emit("endCall", calling.userToCall);
    }
    if (caller) {
      socket.emit("endCall", caller.from);
    }
    resetCall();
  };

  const muteUnmute = () => {
    setMyMicStatus((currentStatus) => {
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const updateVideo = () => {
    setMyVideoStatus((currentStatus) => {
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const handleScreenSharing = async () => {
    try {
      // Check if screen sharing is currently active
      if (!screenShare) {
        // Request access to the user's screen
        const currentStream = await navigator.mediaDevices.getDisplayMedia({
          cursor: true
        });

        // Obtain the screen track from the stream
        const screenTrack = currentStream.getTracks()[0];

        // Replace the video track in the connection with the screen track
        connectionRef.current.replaceTrack(
          connectionRef.current.streams[0]
            .getTracks()
            .find((track) => track.kind === "video"),
          screenTrack,
          stream
        );

        // Set up event handler for when screen sharing ends
        screenTrack.onended = () => {
          // Revert back to the previous video track
          connectionRef.current.replaceTrack(
            screenTrack,
            connectionRef.current.streams[0]
              .getTracks()
              .find((track) => track.kind === "video"),
            stream
          );

          // Update UI to display the previous video stream
          setStream(stream);
          setScreenShare(false);
        };

        // Update UI to display the screen stream
        setStream(currentStream);
        screenTrackRef.current = screenTrack;
        setScreenShare(true);
      } else {
        // If screen sharing is active, end it
        screenTrackRef.current.onended();
      }
    } catch (error) {
      // Handle errors
      console.error("Error occurred during screen sharing:", error);
      // Optionally, update UI to inform the user about the error
    }
  };

  const getUserMedia = async (type) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: type === "video" && true,
        audio: true
      });
      setStream(newStream);
      setType(type);
      return newStream;
    } catch (error) {
      console.error("Error getting user media:", error);
    }
  };

  const constructPeer = (socket, type, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      const callData = {
        userToCall: chatting.username,
        userToCallName: chatting.name,
        userToCallImage: chatting.image,
        signalData: data,
        type,
        from: user.username,
        name: user.name,
        image: user.image
      };

      socket.emit("callUser", callData);
      setCalling(callData);
    });

    peer.on("stream", (stream) => {
      setCallerStream(stream);
    });

    connectionRef.current = peer;
  };

  const resetCall = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (callerStream) callerStream.getTracks().forEach((track) => track.stop());

    setReceivingCall(false);
    setCallAccepted(false);
    setCaller(null);
    setCalling(null);
    setMyMicStatus(true);
    setMyVideoStatus(true);
    setScreenShare(false);
    setType("");
    setHide(false);
    setStream(null);
    setCallerStream(null);
    setCurrentTime(0);

    screenTrackRef.current = null;

    if (connectionRef.current) {
      window.location.reload();
    }
  };

  const onCallAccepted = (signal) => {
    setCallAccepted(true);
    if (connectionRef.current) connectionRef.current.signal(signal);
    startTimer();
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);
    return timer;
  };

  return (
    <CallContext.Provider
      value={{
        callUser,
        answerCall,
        receivingCall,
        callAccepted,
        calling,
        caller,
        callerStream,
        leaveCall,
        ignoreCall,
        muteUnmute,
        myMicStatus,
        type,
        updateVideo,
        myVideoStatus,
        handleScreenSharing,
        screenShare,
        setupIncomingCall,
        resetCall,
        currentTime,
        onCallAccepted,
        screenTrackRef,
        hide,
        setHide,
        stream
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => useContext(CallContext);
