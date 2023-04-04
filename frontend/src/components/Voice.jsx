import React, { useState, useRef, useContext } from "react";
import { BsPlayFill } from "react-icons/bs";
import { AiOutlinePause } from "react-icons/ai";
import { ChatContext } from "../utils/ChatContext";
import useContextMenu from "../utils/useContextMenu";
import ContextMenu from "./ContextMenu";
const format = require("format-duration");

export default function Voice({ src, time, sender, username, data }) {
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const { user } = useContext(ChatContext);
  const audioPlayer = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const play = () => {
    audioPlayer.current.play();
    setPlaying(true);
  };
  const pause = () => {
    audioPlayer.current.pause();
    setPlaying(false);
  };
  const stop = () => {
    audioPlayer.current.pause();
    audioPlayer.current.currentTime = 0;
    setPlaying(false);
  };
  const onPlaying = () => {
    setCurrentTime(audioPlayer.current.currentTime);
    setSeekValue(
      (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100
    );
    setDuration(format(audioPlayer.current.duration * 1000));
  };

  const changeSpeed = () => {
    if (speed === 1) {
      setSpeed(1.5);
      audioPlayer.current.playbackRate = 1.5;
    } else if (speed === 1.5) {
      setSpeed(2);
      audioPlayer.current.playbackRate = 2;
    } else {
      setSpeed(1);
      audioPlayer.current.playbackRate = 1;
    }
  };

  const update = () => {
    if (audioPlayer.current.duration === Infinity) {
      audioPlayer.current.currentTime = 1e101;
    }
    setTimeout(() => {
      audioPlayer.current.currentTime = 0;
    }, 500);
  };

  return (
    <div
      className={`${
        sender === username ? "bg-blue-500/90" : "bg-slate-800/90"
      } min-w-[17rem] rounded-full px-3 py-1`}
      onContextMenu={(e) => {
        e.preventDefault();
        setClicked(true);
        setPoints({
          x: e.pageX,
          y: e.pageY,
        });
      }}
    >
      {clicked && data?.sender === user?.username && (
        <ContextMenu
          top={points.y}
          left={points.x}
          messageID={data.id}
          conversationID={data.conversationId}
        />
      )}
      <div className="flex w-full items-center space-x-1">
        {playing ? (
          <AiOutlinePause
            className="-mt-2.5 h-5 w-5 cursor-pointer text-white"
            onClick={pause}
          />
        ) : (
          <BsPlayFill
            className="-mt-2.5 h-5 w-5 cursor-pointer text-white"
            onClick={play}
          />
        )}

        <div className="w-full">
          <audio
            src={src}
            ref={audioPlayer}
            onTimeUpdate={onPlaying}
            onEnded={stop}
            onLoadedMetadata={update}
          />
          <div className="flex items-center justify-between space-x-2">
            <input
              type="range"
              className={`${playing ? "w-[85%]" : "w-[100%]"} rounded-full`}
              min="0"
              max="100"
              step="1"
              value={seekValue}
              onChange={(e) => {
                const seekto =
                  audioPlayer.current.duration * (+e.target.value / 100);
                audioPlayer.current.currentTime = seekto;
                setSeekValue(e.target.value);
              }}
            />
            {playing && (
              <p
                className="mb-1 flex cursor-pointer items-center justify-center rounded-full bg-slate-900/70 px-1.5 text-xs text-white"
                onClick={changeSpeed}
              >
                x{speed}
              </p>
            )}
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="-mt-1.5 text-xs text-white">
              {playing ? format(currentTime * 1000) : duration}
            </p>
            <p className="-mt-1.5 text-xs text-white">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
