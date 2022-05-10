import React from "react";

export default function Video({ data, userName }) {
  return (
    <div
      className={`${
        data?.sender === userName ? "bg-blue-500/90" : "bg-slate-800/90"
      } max-h-auto relative aspect-auto max-w-[17rem] rounded-md text-white md:max-w-[35rem]`}
    >
      <video
        src={data?.message.file}
        controls
        className={`${
          data?.message.text ? "rounded-t-md" : "rounded-md"
        } min-h-[7rem] w-auto min-w-[12rem] cursor-pointer object-contain mix-blend-normal`}
      />
      {data?.message.text && (
        <p className="break-words p-2 pb-4 font-sans">{data?.message.text}</p>
      )}
      <p
        className={`absolute bottom-1 right-1 pr-1 text-right text-[0.75rem] ${
          !data?.message.text &&
          "rounded-full bg-black/30 px-1.5 py-1 text-white"
        }`}
      >
        {new Date(data?.time).toLocaleTimeString().replace(/(.*)\D\d+/, "$1")}
      </p>
    </div>
  );
}
