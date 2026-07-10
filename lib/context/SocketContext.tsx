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

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: SocketProps){
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport("N/A");
    };

    if (socket.connected) onConnect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket, isConnected}}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext);