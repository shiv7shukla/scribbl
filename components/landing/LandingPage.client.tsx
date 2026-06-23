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

    function joinRoom(code: string) {
        const trimmed = ensureName();
        if (!trimmed) return;
        const c = code.trim().toUpperCase();
        if (c.length < 4) {
            toast.error("Enter a valid room code");
            return;
        }
        router.push("/lobby")
    }

    return (
        <main className="max-w-md mx-auto px-4 pb-16">
            <section className="pop-card-lg p-6 space-y-6">
            <div>
                <label className="block font-display text-lg mb-2">
                    Your nickname
                </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Captain Doodle"
                    maxLength={20}
                    className="w-full px-4 py-3 text-lg font-bold border-[3px] border-border rounded-xl bg-input focus:outline-none focus:ring-4 focus:ring-primary/30"
                />
            </div>

            <div className="pt-2">
                <label className="block font-display text-lg mb-2">
                Have a room code?
                </label>
                <div className="flex gap-2">
                <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength={8}
                    className="flex-1 px-4 py-3 text-lg font-bold tracking-widest uppercase border-[3px] border-border rounded-xl bg-input focus:outline-none focus:ring-4 focus:ring-primary/30"
                />
                <button
                    onClick={() => joinRoom(joinCode)}
                    className="pop-card pop-press px-6 font-display text-lg bg-primary text-primary-foreground rounded-xl cursor-pointer"
                >
                    Join
                </button>
                </div>
            </div>
            </section>
        </main>
    );
}

export default InputBox
