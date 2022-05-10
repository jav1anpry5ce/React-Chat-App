import React from "react";
import { MdDownloading } from "react-icons/md";
import Linkify from "react-linkify";

function downloadFile(file, name) {
  const linkSource = file;
  const downloadLink = document.createElement("a");

  downloadLink.href = linkSource;
  downloadLink.download = name;
  downloadLink.click();
}

export default function File({ data, userName }) {
  return (
    <div
      className={`max-w-xs break-words md:max-w-lg ${
        data?.sender === userName ? "bg-blue-500/90" : "bg-slate-800/90"
      } rounded  text-white`}
    >
      <div
        className={`flex transform items-center
              justify-between space-x-2 rounded-t 
              px-2 py-1.5 text-white duration-300 ${
                data?.message.text
                  ? "bg-slate-700"
                  : data?.sender === userName
                  ? "bg-blue-500/0"
                  : "bg-slate-800/90"
              }`}
      >
        <p>{data?.message.name}</p>
        <MdDownloading
          className="mt-1 h-7 w-7 cursor-pointer text-white hover:text-gray-300 md:h-6 md:w-6"
          onClick={() => {
            downloadFile(data?.message.file, data?.message.name);
          }}
        />
      </div>
      {data?.message.text && (
        <Linkify
          properties={{
            target: "_blank",
          }}
        >
          <p className="px-2 py-1.5 font-sans">{data?.message.text}</p>
        </Linkify>
      )}
      <p className="pb-1 pr-1 text-right text-[0.63rem]">
        {new Date(data?.time).toLocaleTimeString().replace(/(.*)\D\d+/, "$1")}
      </p>
    </div>
  );
}
