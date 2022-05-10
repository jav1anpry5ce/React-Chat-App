import React from "react";
import { Text, Audio, Image, File, Video } from "./Messages";
import { motion } from "framer-motion";

export default function Message({ data, userName }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${
        data?.sender === userName ? "justify-items-end" : "justify-items-start"
      } my-2`}
    >
      {data?.message.type === "text" ? (
        <Text data={data} userName={userName} />
      ) : data?.message.type === "audio" ? (
        <Audio data={data} userName={userName} />
      ) : data?.message.type === "image" ? (
        <Image data={data} userName={userName} />
      ) : data?.message.type === "application" ? (
        <File data={data} userName={userName} />
      ) : data?.message.type === "video" ? (
        <Video data={data} userName={userName} />
      ) : null}
    </motion.div>
  );
}
