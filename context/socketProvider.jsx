"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { data } = useSession();
  const [Socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(socket);

    socket.on("connected", () => {
      console.log("Socket connected");
    });

    socket.on("disconnected", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socket.off("orderUpdated"); // Cleanup when component unmounts
      socket.off("connected");
      socket.off("disconnected");
    };
  }, []);

  useEffect(() => {
    if (data?.user) {
      console.log(data.user.email,'email')
      socket.emit("joinRoom", data.user.email);
      console.log('1111111111')
    }
  }, [data]);

  useEffect(() => {
    const handleOrderUpdated = (msg) => {
      console.log("Order updated: ", msg);
      toast.success("Order updated");
    };

    socket.on("orderUpdated", handleOrderUpdated);

    return () => {
      socket.off("orderUpdated", handleOrderUpdated); // Cleanup listener
    };
  }, []); // Ensure this runs once

  return (
    <SocketContext.Provider value={Socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
