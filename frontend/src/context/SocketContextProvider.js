import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = io(`https://api.chatapp.home`, {
    transports: ["websocket"],
  });

  socket.connect();
  console.log(socket);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
