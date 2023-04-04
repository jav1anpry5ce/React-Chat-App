import React from "react";
import Voice from "../Voice";

export default function Audio({ data, username }) {
  return (
    <Voice
      src={data?.message.data}
      time={new Date(data?.time)
        .toLocaleTimeString()
        .replace(/(.*)\D\d+/, "$1")}
      sender={data.sender.username}
      username={username}
      data={data}
    />
  );
}
