"use client";
import { io } from "socket.io-client"; 
export const socket = io(undefined, { 
    autoConnect: false, 
    reconnection: false, 
    transports: ["websocket"], 
    timeout: 5000, 
});