"use client";

import { useGameStore } from "@/app/providers/game-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import Canvas from "../canvas/Canvas";
import ChatPanel from "../ChatPanel.client";
import CountdownTimer from "../CountdownTimer";
import LobbyContent from "../lobby/LobbyContent.client";
import PlayerList from "../PlayerList.client";
import GameOverlay from "./GameOverlay.client";

const RoomContent = ({ roomId }: { roomId: string }) => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const roomCode = useGameStore((state) => state.roomCode);
  const players = useGameStore((state) => state.players);
  const guessWord = useGameStore((state) => state.guessWord);
  const overlay = useGameStore((state) => state.overlay);
  const { setRoomCode } = useGameStore((state) => state.actions);

  useEffect(() => {
    setRoomCode(roomId);
  }, [roomId, setRoomCode]);

  if (gamePhase === "lobby") {
    return <LobbyContent />;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Toaster position="top-center" />

      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <div className="text-center">
            <h1 className="font-display text-2xl text-white tracking-tight">scribbl</h1>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl text-white tracking-tight">{guessWord}</h1>
            <p className="text-xs text-muted-foreground">{roomCode}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {overlay.type === null ?
            <h1 className="font-display text-2xl text-white tracking-tight tabular-nums"><CountdownTimer /></h1> : null}
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] flex-col gap-4 p-4 lg:flex-row">
        <aside className="order-2 flex-1 p-4 lg:order-1">
          <PlayerList />
        </aside>

        <section className="order-1 relative order-1 flex-[3] overflow-hidden p-4 lg:order-2">
          <Canvas />
          <GameOverlay />
        </section>

        <aside className="order-3 flex-1 p-4">
          <ChatPanel players={players} />
        </aside>
      </main>
    </div>
  );
};

export default RoomContent;
