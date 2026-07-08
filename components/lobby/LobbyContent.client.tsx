"use client";
import { useSearchParams } from 'next/navigation';

const LobbyContent = () => {
  const searchParams = useSearchParams();
    const roomCode = searchParams.get("roomCode") ?? "—";
    const name = searchParams.get("name") ?? "Guest";

    return (
        <main className="min-h-screen bg-background px-4 py-16">
            <section className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
                <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        Lobby
                    </p>
                    <h1 className="font-display text-3xl font-semibold tracking-tight">
                        Welcome, {name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Share this room code with your friends to start playing.
                    </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                        Room code
                    </p>
                    <p className="mt-2 font-display text-5xl font-semibold tracking-[0.3em] text-primary">
                        {roomCode}
                    </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                    <p className="font-display text-lg">Players</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        The waiting room is ready. Your friends can join with the code above.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default LobbyContent;
