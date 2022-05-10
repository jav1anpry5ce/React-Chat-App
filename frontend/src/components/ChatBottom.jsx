import React, { useState, useEffect, useContext } from "react";
import useRecorder from "../utils/useRecorder";
import { BsMicFill, BsStopCircle } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FcAddImage } from "react-icons/fc";
import { MdCancel } from "react-icons/md";
import { ChatContext } from "../utils/ChatContext";
import { motion } from "framer-motion";

export default function ChatBottom() {
  const { socket, chatting, userName, sendMessage, conversationId } =
    useContext(ChatContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  let [isRecording, startRecording, stopRecording, audio, cancelRecording] =
    useRecorder();
  const input = document.getElementById("input-field");

  useEffect(() => {
    if (audio) {
      const data = {
        audio,
        conversationId,
      };
      sendMessage(data);
    }
    // eslint-disable-next-line
  }, [audio]);

  const send = () => {
    if (file) {
      const data = {
        file,
        conversationId,
        text,
      };
      sendMessage(data).then(() => {
        setFile(null);
        setText("");
        document.getElementById("file-input").value = null;
      });
    } else {
      const data = {
        conversationId,
        text,
      };
      sendMessage(data).then(() => {
        setText("");
      });
    }
  };

  const addFile = () => {
    document.getElementById("file-input").click();
  };

  useEffect(() => {
    if (input) {
      input.addEventListener("keydown", (event) => {
        socket.emit("typing", {
          userName: chatting?.userName,
          typing: userName,
        });
        if (event.code === "Enter") {
          event.preventDefault();
          document.getElementById("send-message").click();
        }
      });
    }
    // eslint-disable-next-line
  }, [input]);

  return (
    <motion.div
      layout
      className="flex items-center space-x-2 bg-slate-700/90 py-4 px-2 text-white dark:bg-slate-600/95"
    >
      <div className="flex space-x-2">
        <FcAddImage size={25} className="cursor-pointer" onClick={addFile} />
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <div className="flex max-w-[50px] items-center space-x-1.5 truncate md:max-w-md">
            <p className="truncate">{file.name}</p>
            <MdCancel
              className="mt-0.5 w-24 cursor-pointer md:h-5 md:w-5"
              onClick={() => {
                setFile(null);
                document.getElementById("file-input").value = null;
              }}
              aria-label="Delete"
            />
          </div>
        )}
      </div>
      <input
        className="grow rounded-full bg-slate-800 px-3 py-1 text-white focus-within:bg-slate-800 focus:outline-none focus-visible:bg-slate-800"
        aria-label="text-field"
        value={text}
        autoComplete="off"
        onChange={(e) => setText(e.target.value)}
        id="input-field"
        autoFocus
        placeholder="Type a message"
      />

      {text || file ? (
        <button
          className="flex items-center  rounded-full bg-blue-400 p-1 text-white"
          onClick={send}
          id="send-message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 translate-x-[1px] rotate-90 transform  "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      ) : isRecording === true ? (
        <div className="flex space-x-4">
          <BsStopCircle
            onClick={cancelRecording}
            className="cursor-pointer"
            size={25}
          />
          <AiOutlineCheckCircle
            onClick={stopRecording}
            className="cursor-pointer"
            size={25}
          />
        </div>
      ) : (
        <BsMicFill
          onClick={startRecording}
          className="cursor-pointer"
          size={25}
          aria-label="record"
        />
      )}
    </motion.div>
  );
}
