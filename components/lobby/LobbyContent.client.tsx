"use client";

import { Toaster } from "@/components/ui/sonner";
import {
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LobbyChatPanel from "./LobbyChatPanel.client";
import { LobbySettings } from "@/lib/types/types";
import LobbyPlayerList from "./LobbyPlayerList.client";
import LobbySettingsPanel from "./LobbySettingsPanel.client";
import { useGameStore } from "@/app/providers/game-store-provider";
import { useShallow } from "zustand/shallow";


const PLAYER_COLORS = [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f1c40f",
        "#e67e22",
        "#9b59b6",
        "#1abc9c",
        "#e91e63",
        "#34495e",
        "#95a5a6",
        "#16a085",
        "#d35400",
        ];

export default function LobbyContent() {
  const [settings, setSettings] = useState<LobbySettings>({
    rounds: 3,
    drawTime: 80,
    maxPlayers: 8,
    customWords: "",
    useCustomWordsOnly: false,
    hints: 2,
  });
  const {
    totalRounds, 
    maxPlayers, 
    players,
    currPlayer,
    drawTime,
    roomCode,
    } = useGameStore(useShallow((state) => ({
      totalRounds: state.totalRounds, 
      maxPlayers: state.maxPlayers, 
      players: state.players,
      drawTime: state.drawTime,
      roomCode: state.roomCode,
      currPlayer: state.currPlayer
    })));

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="border-b-2 border-border/60 bg-card/80 backdrop-blur-sm h-17">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="pop-btn pop-press inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold"
          >
            <Home className="size-4" />
            Home
          </Link>
          <div className="text-center">
            <h1 className="font-display text-xl tracking-tight sm:text-2xl">scribbl</h1>
            <p className="text-xs text-muted-foreground">Draw. Guess. Repeat.</p>
          </div>
          <div className="w-[88px]" aria-hidden />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[minmax(220px,280px)_1fr_minmax(240px,320px)] lg:items-start lg:gap-5 lg:p-5">
        <div className="order-2 lg:order-1 lg:min-h-[calc(100vh-5.5rem)]">
          <LobbyPlayerList
             players={players.slice(0, settings.maxPlayers)}
            maxPlayers={settings.maxPlayers}
            meId={me.id}
          />
        </div>

        <div className="order-1 lg:order-2 lg:min-h-[calc(100vh-5.5rem)]">
          <LobbySettingsPanel
            settings={settings}
            isHost={currPlayer.isAdmin}
            onSettingsChange={(patch) =>
              setSettings((prev) => ({ ...prev, ...patch }))
            }
          />
        </div>

        <div className="order-3 lg:min-h-[calc(100vh-5.5rem)]">
          <LobbyChatPanel players={players} />
        </div>
      </main>
    </div>
  );
}
