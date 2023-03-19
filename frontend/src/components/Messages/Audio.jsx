import React from "react";
import Voice from "../Voice";

export default function Audio({ data, userName }) {
  return (
    <Voice
      src={data?.message.data}
      time={new Date(data?.time)
        .toLocaleTimeString()
        .replace(/(.*)\D\d+/, "$1")}
      sender={data.sender}
      userName={userName}
      data={data}
    />
  );
}
