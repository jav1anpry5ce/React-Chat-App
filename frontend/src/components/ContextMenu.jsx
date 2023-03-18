import React from "react";

export default function ContextMenu({ top, left, messageID }) {
  return (
    <div
      className={`fixed w-fit rounded bg-slate-800 p-4 text-white top-[${top}px] left-[${left}px]`}
    >
      <ul>
        <li>Edit</li>
        <li>Delete</li>
      </ul>
    </div>
  );
}
