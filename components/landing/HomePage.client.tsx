"use client";

import { useGameStore } from "@/app/providers/game-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { useSocketListeners } from "@/lib/socket/socketEvents";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export default function HomePage() {
    const [name, setName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const router = useRouter();
    const { setRoomCode, setUserName, enterRoom } = useGameStore((state) => state.actions);
    const { currPlayer } = useGameStore(useShallow((state) => ({
        currPlayer: state.currPlayer
    })));

    function ensureName(): string | null {
      const trimmed = currPlayer.username.trim().slice(0, 20);
      if (!trimmed) {
          toast.error("Pick a nickname first!");
          return null;
      }
      return trimmed;
    }

    function createRoom() {
      const trimmed = ensureName();
      if (!trimmed) return;

      const code = String(crypto.randomUUID());
      setRoomCode(code);
      enterRoom(currPlayer);
      router.push(`/room/${code}`);
    }

    function joinRoom(code: string) {
      const trimmed = ensureName();
      if (!trimmed) return;

      const c = code.trim();
      if (!c) {
        toast.error("Enter a room code!");
        return;
      }
      setRoomCode(code);
      router.push(`/room/${c}`);
    }

    useSocketListeners();
    
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="max-w-xl mx-auto px-4 pt-16 pb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          scribbl
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw. Guess. Repeat.
        </p>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16">
            <section className="pop-card-lg space-y-6 bg-card p-6">
                <div>
                    <label className="mb-2 block font-display text-lg">
                        Your nickname
                    </label>
                    <input
                        value={currPlayer.username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Captain Doodle"
                        maxLength={20}
                        className="w-full rounded-xl border-[3px] border-border bg-input px-4 py-3 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary/30"
                    />
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-display text-lg">Create a room</p>
                            <p className="text-sm text-muted-foreground">
                                Start a new game lobby.
                            </p>
                        </div>
                        <button
                            onClick={createRoom}
                            className="pop-btn-primary pop-press rounded-xl px-5 py-3 font-display text-lg cursor-pointer"
                        >
                            Create
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <p className="mb-3 font-display text-lg">Join a room</p>
                    <div className="flex gap-2">
                        <input
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                            className="flex-1 rounded-xl border-[3px] border-border bg-input px-4 py-3 text-lg font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/30"
                        />
                        <button
                            onClick={() => joinRoom(joinCode)}
                            className="pop-btn-primary pop-press rounded-xl px-5 py-3 font-display text-lg cursor-pointer"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </section>
        </main>
    </div>
  );
}
