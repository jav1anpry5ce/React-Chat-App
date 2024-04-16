import { AiOutlineEye } from "react-icons/ai";
import { useMainContext } from "../../context/MainContextProvider";
import Linkify from "react-linkify";
import useContextMenu from "../../utils/useContextMenu";
import ContextMenu from "../ContextMenu";
import { useUserContext } from "../../context/UserContextProvider";

export default function Image({ data, username }) {
  const { setViewing, setViewSrc } = useMainContext();
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const { user } = useUserContext();

  return (
    <div
      className={`${
        data?.message?.text !== "" && data?.sender.username === username
          ? "bg-blue-500/90"
          : "bg-slate-800/90"
      } max-h-auto relative max-w-[20rem] rounded-md text-white md:max-w-[27rem]`}
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
      <div
        className="group relative cursor-pointer"
        onClick={() => {
          setViewing(true);
          setViewSrc(data?.message.file);
        }}
      >
        <div className="absolute hidden h-full w-full items-center justify-center rounded-md bg-black/40 group-hover:flex">
          <AiOutlineEye className="h-5 w-5" />
          <p className="text-lg text-white">View Image</p>
        </div>
        <img
          src={data?.message.file}
          alt="img"
          className={`${
            data?.message.text ? "rounded-t-md" : "rounded-md"
          } max-h-[16.5rem] min-h-[10rem] w-auto min-w-[5rem] cursor-pointer object-contain mix-blend-normal md:max-h-[37rem] md:max-w-[27rem]`}
          loading="lazy"
        />
      </div>
      {data?.message.text && (
        <Linkify
          properties={{
            target: "_blank"
          }}
        >
          <p className="break-words p-2 pb-4 font-sans">{data?.message.text}</p>
        </Linkify>
      )}
      <p
        className={`absolute bottom-1 right-1 pr-1 text-right text-[0.75rem] ${
          !data?.message.text &&
          "rounded-full bg-black/70 px-1.5 py-0.5 text-white backdrop-blur"
        }`}
      >
        {new Date(data?.time).toLocaleTimeString().replace(/(.*)\D\d+/, "$1")}
      </p>
    </div>
  );
}
