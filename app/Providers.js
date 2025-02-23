"use client";
import { SocketProvider } from "@/context/socketProvider";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
    {children}
    </SessionProvider>
  );
};
