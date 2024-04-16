import { MdDownloading } from "react-icons/md";
import Linkify from "react-linkify";
import useContextMenu from "../../utils/useContextMenu";
import ContextMenu from "../ContextMenu";
import { useUserContext } from "../../context/UserContextProvider";

function downloadFile(file, name) {
  const linkSource = file;
  const downloadLink = document.createElement("a");

  downloadLink.href = linkSource;
  downloadLink.download = name;
  downloadLink.click();
}

export default function Text({ data, username }) {
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const { user } = useUserContext();
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setClicked(true);
        setPoints({
          x: e.pageX,
          y: e.pageY
        });
      }}
    >
      {clicked && data?.sender.username === user?.username && (
        <ContextMenu
          top={points.y}
          left={points.x}
          messageID={data.id}
          conversationID={data.conversationId}
        />
      )}
      {data?.message.file ? (
        <div
          className={`max-w-[15rem] break-words md:max-w-lg ${
            data?.sender.username === username
              ? "bg-blue-500/90"
              : "bg-slate-800/90"
          } rounded  text-white`}
        >
          <div
            className={`transform justify-between  
               px-2 text-white duration-300 ${
                 data?.message.text ? "rounded-t" : "rounded"
               } ${
              data?.message.text
                ? "bg-slate-700"
                : data?.sender === username
                ? "bg-blue-500/90"
                : "bg-slate-800/90"
            }`}
          >
            <div className="flex items-center space-x-2">
              <p>{data?.message.name}</p>
              <MdDownloading
                className="mt-1 h-5 w-5 cursor-pointer text-white hover:text-gray-300 md:h-6 md:w-6"
                onClick={() => {
                  downloadFile(data?.message.file, data?.message.name);
                }}
              />
            </div>
            <p className="py-1 text-right text-[0.63rem]">
              {new Date(data?.time)
                .toLocaleTimeString()
                .replace(/(.*)\D\d+/, "$1")}
            </p>
          </div>
          {data?.message.text && (
            <div>
              <Linkify
                properties={{
                  target: "_blank"
                }}
              >
                <p className="px-2 py-1.5 font-sans">{data?.message.text}</p>
              </Linkify>
              <p className="py-1 text-right text-[0.63rem]">
                {new Date(data?.time)
                  .toLocaleTimeString()
                  .replace(/(.*)\D\d+/, "$1")}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`
        ${
          data?.message.type === "text"
            ? data?.sender.username === username
              ? "bg-blue-500/90 text-white"
              : "bg-slate-800/90 text-white"
            : "bg-transparent"
        }
         min-w-[7rem] max-w-[15rem] rounded-xl px-3 leading-none md:max-w-sm`}
        >
          <Linkify
            properties={{
              target: "_blank"
            }}
          >
            <p className="break-words pt-1 font-sans leading-relaxed">
              {data?.message.text}
            </p>
          </Linkify>
          <p className="py-1 text-right text-[0.63rem]">
            {new Date(data?.time)
              .toLocaleTimeString()
              .replace(/(.*)\D\d+/, "$1")}
          </p>
        </div>
      )}
    </div>
  );
}
