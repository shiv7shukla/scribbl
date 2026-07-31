"use client";

import { useGameStore } from "@/app/providers/game-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export default function HomePage() {
    const [joinCode, setJoinCode] = useState("");
    const router = useRouter();
    const { setRoomCode, setUserName, enterRoom } = useGameStore((state) => state.actions);
    const { currPlayer } = useGameStore(useShallow((state) => ({
        currPlayer: state.currPlayer
    })));
    const { setCurrPlayer } = useGameStore((state) => state.actions);

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
        setCurrPlayer({ isAdmin: true });
        enterRoom(currPlayer, true);
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
        enterRoom(currPlayer, false);
        router.push(`/room/${c}`);
    }

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
            <section className="surface-card-lg space-y-6 p-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                        Your nickname
                    </label>
                    <input
                        value={currPlayer.username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter a nickname"
                        maxLength={20}
                        className="w-full rounded-lg border border-border bg-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-medium">Create a room</p>
                            <p className="text-sm text-muted-foreground">
                                Start a new game lobby.
                            </p>
                        </div>
                        <button
                            onClick={createRoom}
                            className="surface-btn-primary px-5 py-2.5 text-sm font-medium cursor-pointer"
                        >
                            Create
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <p className="mb-3 font-medium">Join a room</p>
                    <div className="flex gap-2">
                        <input
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            placeholder="Room code"
                            className="flex-1 rounded-lg border border-border bg-input px-4 py-2.5 text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                        <button
                            onClick={() => joinRoom(joinCode)}
                            className="surface-btn-primary px-5 py-2.5 text-sm font-medium cursor-pointer"
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
