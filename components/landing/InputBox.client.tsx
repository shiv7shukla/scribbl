"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const InputBox = () => {
    const [name, setName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const router = useRouter();

    function ensureName(): string | null {
        const trimmed = name.trim().slice(0, 20);
        if (!trimmed) {
            toast.error("Pick a nickname first!");
            return null;
        }
        return trimmed;
    }

    function createRoom() {
        const trimmed = ensureName();
        if (!trimmed) return;

        const code = String(Math.floor(1000 + Math.random() * 9000));
        toast.success(`Room created! Your code is ${code}`);
        router.push(`/lobby?roomCode=${code}&name=${encodeURIComponent(trimmed)}`);
    }

    function joinRoom(code: string) {
        const trimmed = ensureName();
        if (!trimmed) return;

        const c = code.trim();
        if (!/^\d{4,6}$/.test(c)) {
            toast.error("Enter a valid 4-6 digit room code");
            return;
        }

        router.push(`/lobby?roomCode=${c}&name=${encodeURIComponent(trimmed)}`);
    }

    return (
        <main className="mx-auto max-w-md px-4 pb-16">
            <section className="pop-card-lg space-y-6 p-6">
                <div>
                    <label className="mb-2 block font-display text-lg">
                        Your nickname
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                                Start a new game and share a fresh room code.
                            </p>
                        </div>
                        <button
                            onClick={createRoom}
                            className="pop-card pop-press rounded-xl bg-primary px-5 py-3 font-display text-lg text-primary-foreground cursor-pointer"
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
                            placeholder="1234"
                            maxLength={6}
                            className="flex-1 rounded-xl border-[3px] border-border bg-input px-4 py-3 text-lg font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/30"
                        />
                        <button
                            onClick={() => joinRoom(joinCode)}
                            className="pop-card pop-press rounded-xl bg-primary px-5 py-3 font-display text-lg text-primary-foreground cursor-pointer"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default InputBox;
