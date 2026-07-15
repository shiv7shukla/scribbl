"use client";
import { useSearchParams } from 'next/navigation';

const LobbyContent = () => {
  const searchParams = useSearchParams();
    const roomCode = searchParams.get("roomCode") ?? "—";
    const name = searchParams.get("name") ?? "Guest";

    return (
        <main className="min-h-screen bg-background px-4 py-16">
            
        </main>
    );
}

export default LobbyContent;
