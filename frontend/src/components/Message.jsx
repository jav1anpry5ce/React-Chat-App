import React from "react";
import { Text, Audio, Image, File, Video } from "./Messages";
import { motion } from "framer-motion";

export default function Message({ data, username, chat }) {
  if (data.message?.wasUnsent) {
    return (
      <div
        className={`flex w-full ${
          data.sender.username === username ? "justify-end" : "justify-start"
        }`}
      >
        <motion.div
          className={`flex w-fit flex-col gap-y-0.5 bg-gray-500/40 pb-3 pt-4 font-sans text-xs text-white backdrop-blur ${
            data.sender.username === username
              ? "message-clip-sender pl-2 pr-8"
              : "message-clip-receiver pl-8 pr-4"
          } `}
        >
          <p className="font-semibold">This message was unsent!</p>
          <span className="text-right">
            {new Date(data?.time)
              .toLocaleTimeString()
              .replace(/(.*)\D\d+/, "$1")}
          </span>
        </motion.div>
      </div>
    );
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex ${
        data?.sender.username === username ? "justify-end" : "justify-start"
      } my-2`}
    >
      {data?.message?.type === "text" ? (
        <div className="flex items-end gap-2">
          {chat.chatType === "group" && data.sender.username !== username && (
            <img
              src={data.sender.image}
              className="aspect-square h-8 w-8 rounded-full object-cover"
              alt=""
            />
          )}
          <div>
            {chat.chatType === "group" && data.sender.username !== username && (
              <p className="ml-3 pb-0.5 text-[11px] text-white">
                {data.sender.name}
              </p>
            )}
            <Text data={data} username={username} />
          </div>
        </div>
      ) : data?.message?.type === "audio" ? (
        <div className="flex items-end gap-2">
          {chat.chatType === "group" && data.sender.username !== username && (
            <img
              src={data.sender.image}
              className="aspect-square h-8 w-8 rounded-full object-cover"
              alt=""
            />
          )}
          <div>
            {chat.chatType === "group" && data.sender.username !== username && (
              <p className="ml-3 pb-0.5 text-[11px] text-white">
                {data.sender.username}
              </p>
            )}
            <Audio data={data} username={username} />
          </div>
        </div>
      ) : data?.message?.type === "image" ? (
        <div className="flex items-end gap-2">
          {chat.chatType === "group" && data.sender.username !== username && (
            <img
              src={data.sender.image}
              className="aspect-square h-8 w-8 rounded-full object-cover"
              alt=""
            />
          )}
          <div>
            {chat.chatType === "group" && data.sender.username !== username && (
              <p className="ml-1 pb-0.5 text-[11px] text-white">
                {data.sender.name}
              </p>
            )}
            <Image data={data} username={username} />
          </div>
        </div>
      ) : data?.message?.type === "application" ? (
        <div className="flex items-end gap-2">
          {chat.chatType === "group" && data.sender.username !== username && (
            <img
              src={data.sender.image}
              className="aspect-square h-8 w-8 rounded-full object-cover"
              alt=""
            />
          )}
          <div>
            {chat.chatType === "group" && data.sender.username !== username && (
              <p className="ml-3 pb-0.5 text-[11px] text-white">
                {data.sender.name}
              </p>
            )}
            <File data={data} username={username} />
          </div>
        </div>
      ) : data?.message?.type === "video" ? (
        <div className="flex items-end gap-2">
          {chat.chatType === "group" && data.sender.username !== username && (
            <img
              src={data.sender.image}
              className="aspect-square h-8 w-8 rounded-full object-cover"
              alt=""
            />
          )}
          <div>
            {chat.chatType === "group" && data.sender.username !== username && (
              <p className="ml-3 pb-0.5 text-[11px] text-white">
                {data.sender.name}
              </p>
            )}
            <Video data={data} username={username} />
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
