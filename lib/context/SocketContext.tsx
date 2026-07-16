"use client";

import { socket } from "@/app/socket";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";


interface SocketProps{
  children: ReactNode
}
interface SocketContextType{
  socket: Socket;
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: SocketProps){
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
    };
    
    const onUpgrade = (transport: { name: string }) => {
      setTransport(transport.name);
    }
    
    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };
    
    if (socket.connected) onConnect();
    
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    // socket.io.engine.on("upgrade", onUpgrade);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // socket.off("upgrade", onUpgrade);
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket, isConnected}}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket () {
  const context = useContext(SocketContext);
  if(!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}