// components/room/RoomContent.client.tsx
"use client";

import { useEffect } from "react";
import LobbyContent from "../lobby/LobbyContent.client";
import Canvas from "../canvas/Canvas";
import GameOverlay from "./GameOverlay.client";
import { useGameStore } from "@/app/providers/game-store-provider";
import { Home } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const RoomContent = ({ roomId }: { roomId: string }) => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const roomCode = useGameStore((state) => state.roomCode);
  const players = useGameStore((state) => state.players);
  const guessWord = useGameStore((state) => state.guessWord);
  const currPlayer = useGameStore((state) => state.currPlayer);
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
          <Link
            href="/"
            className="surface-btn inline-flex items-center gap-2 px-3 py-2 text-sm font-medium"
          >
            <Home className="size-4" />
            Home
          </Link>
          <div className="text-center">
            <h1 className="font-display text-2xl text-white tracking-tight">{guessWord}</h1>
            <p className="text-xs text-muted-foreground">{roomCode}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {players.length} players
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] flex-col gap-4 p-4 lg:flex-row">
        <aside className="surface-card order-2 flex-1 p-4 lg:order-1">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Players</h2>
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2"
              >
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: player.color }}
                >
                  {player.username.charAt(0).toUpperCase()}
                </div>
                <span className="truncate text-sm font-medium">{player.username}</span>
                {player.isDrawer && (
                  <span className="ml-auto text-xs text-muted-foreground">drawing</span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <section className="surface-card relative order-1 flex-[3] overflow-hidden p-4 lg:order-2">
          <Canvas />
          <GameOverlay />
        </section>

        <aside className="surface-card order-3 flex-1 p-4">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Chat</h2>
          <p className="text-sm text-muted-foreground">Coming soon</p>
        </aside>
      </main>
    </div>
  );
};

export default RoomContent;
