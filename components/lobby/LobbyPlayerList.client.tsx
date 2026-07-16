"use client";

import { Player } from '@/lib/types/types';
import { Users, Crown } from 'lucide-react';
import React, { useMemo } from 'react'

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

const LobbyPlayerList = ({
  players,
  maxPlayers,
  meId,
}: {
  players: Player[];
  maxPlayers: number;
  meId: string;
}) => {
    
    
    const emptySlots = Math.max(0, maxPlayers - players.length);
    

    return (
    <aside className="pop-card-lg flex h-full flex-col bg-paper p-4">
        <div className="mb-4 flex items-center gap-2 border-b-2 border-border/60 pb-3">
            <Users className="size-5" />
            <h2 className="font-display text-lg">Players</h2>
            <span className="ml-auto text-sm font-bold text-muted-foreground">
                {players.length}/{maxPlayers}
            </span>
        </div>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {players.map((player, index) => (
            <li
                key={player.id}
                className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 ${
                player.id === meId
                    ? "border-foreground bg-muted/50"
                    : "border-border/50 bg-background/50"
                }`}
            >
                <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-sm font-bold text-white shadow-[2px_2px_0_0_var(--foreground)]"
                    style={{ backgroundColor: player.color }}
                    aria-hidden
                >
                    {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <span className="truncate font-bold">{player.name}</span>
                            {player.isHost && (
                            <Crown className="size-4 shrink-0 text-amber-500" aria-label="Host" />
                            )}
                        {player.id === meId && (
                        <span className="text-xs font-bold text-muted-foreground">(you)</span>
                    )}
                    </div>
                </div>
                <span className="font-display text-lg tabular-nums">{player.score}</span>
            </li>
            ))}

            {Array.from({ length: emptySlots }).map((_, i) => (
            <li
                key={`empty-${i}`}
                className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 px-3 py-2.5 opacity-50"
            >
                <div
                    className="size-9 shrink-0 rounded-full border-2 border-dashed border-border bg-muted/30"
                    style={{ backgroundColor: `${PLAYER_COLORS[(players.length + i) % PLAYER_COLORS.length]}22` }}
                />
                <span className="text-sm font-bold text-muted-foreground">Waiting...</span>
            </li>
            ))}
        </ul>
    </aside>
  );
}

export default LobbyPlayerList
