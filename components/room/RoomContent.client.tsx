// components/room/RoomContent.client.tsx
"use client";

import { useState, useEffect } from "react";
import LobbyContent from "../lobby/LobbyContent.client";
import Canvas from "../canvas/Canvas";
import { useGameStore } from "@/app/providers/game-store-provider";

const RoomContent = ({ roomId }: { roomId: string }) => {
  const gamePhase = useGameStore((state) => state.gamePhase );

  useEffect(() => {
    // const onSettings = (s) => updateRoomSettings(s); // your zustand store, per game-store.ts
    // const onStroke = (stroke) => appendStroke(stroke);
    // const onGameStart = () => setGamePhase("playing");

    // socket.on(`room:${roomId}:settings`, onSettings);
    // socket.on(`room:${roomId}:stroke`, onStroke);
    // socket.on(`room:${roomId}:gameStart`, onGameStart);

    return () => {
    //   socket.off(`room:${roomId}:settings`, onSettings);
    //   socket.off(`room:${roomId}:stroke`, onStroke);
    //   socket.off(`room:${roomId}:gameStart`, onGameStart);
    };
  }, [roomId]);

  return gamePhase === "lobby" ? <LobbyContent /> :
    <div className="min-h-screen w-full bg-amber-600 p-4">
        <div className="h-[8vh] max-w-[1600px] rounded-3xl bg-blue-400 "></div>
            <div className="mx-auto flex min-h-[85vh] max-w-[1600px] flex-col gap-4 p-4 lg:flex-row">
                <div className="order-2 lg:order-1 lg:flex-1 rounded-3xl bg-white/80 p-4 shadow-lg">
            </div>
            <div className="order-1 flex-1 rounded-3xl bg-white/90 p-4 shadow-lg lg:order-2 lg:flex-2">
                <Canvas />
            </div>
            <div className="order-3 lg:flex-1 rounded-3xl bg-white/80 p-4 shadow-lg">
            </div>
        </div>
    </div>
}

export default RoomContent