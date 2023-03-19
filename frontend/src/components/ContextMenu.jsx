import { useContext } from "react";
import { ChatContext } from "../utils/ChatContext";

export default function ContextMenu({ top, left, messageID, conversationID }) {
  const { deleteMessage } = useContext(ChatContext);
  return (
    <div
      className={`fixed top-0 z-50 w-fit rounded bg-slate-800 p-4 text-white`}
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <ul>
        <li>
          <button
            className="transition duration-75 hover:font-semibold hover:text-red-500"
            onClick={() => deleteMessage(messageID, conversationID)}
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
