import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to the socket server
      const newSocket = io(
        process.env.REACT_APP_API_URL || "http://localhost:5100",
        {
          path: "/socket.io",
          transports: ["websocket", "polling"],
          withCredentials: true,
        }
      );

      // Join user's room for notifications and messages
      newSocket.on("connect", () => {
        newSocket.emit("join", user._id);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
