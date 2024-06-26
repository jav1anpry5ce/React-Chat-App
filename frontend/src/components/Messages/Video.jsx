import useContextMenu from "../../utils/useContextMenu";
import ContextMenu from "../ContextMenu";
import { useUserContext } from "../../context/UserContextProvider";

export default function Video({ data, username }) {
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const { user } = useUserContext();
  return (
    <div
      className={`${
        data?.sender.username === username
          ? "bg-blue-500/90"
          : "bg-slate-800/90"
      } relative aspect-auto max-h-[450px] max-w-[650px] rounded-md text-white`}
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
      <video
        src={data?.message.file}
        controls
        className={`${
          data?.message.text ? "rounded-t-md" : "rounded-md"
        } aspect-auto max-h-[450px] w-auto max-w-[650px] cursor-pointer object-cover mix-blend-normal`}
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
