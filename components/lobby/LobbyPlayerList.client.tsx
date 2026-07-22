"use client";

import { useGameStore } from '@/app/providers/game-store-provider';
import { Player } from '@/lib/types/types';
import { Users, Crown } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

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
//   players,
//   maxPlayers,
}: {
  players: Player[];
  maxPlayers: number;
//   meId: string;
}) => {
    const { 
        totalRounds, 
        maxPlayers, 
        players,
        drawTime, 
        currPlayer
      } = useGameStore(useShallow((state) => ({ 
        totalRounds: state.totalRounds,
        maxPlayers: state.maxPlayers,
        players: state.players,
        currPlayer: state.currPlayer,
        drawTime: state.drawTime,
       })));
    const {
        setDrawTime, 
        setTotalRounds, 
        setMaxPlayers 
    } = useGameStore((state) => state.actions);
    const emptySlots = Math.max(0, maxPlayers - players.length);
    
    return (
    <aside className="surface-card-lg flex h-full flex-col p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
            <Users className="size-5 text-muted-foreground" />
            <h2 className="font-medium">Players</h2>
            <span className="ml-auto text-sm text-muted-foreground">
                {players.length}/{maxPlayers}
            </span>
        </div>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {players.map((player) => (
            <li
                key={player.id}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                player.username === currPlayer.username
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-background/50"
                }`
            }
            >
                <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: player.color }}
                    aria-hidden
                >
                    {player.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium">{player.username}</span>
                            {player.isAdmin && (
                                <Crown className="size-4 shrink-0 text-amber-500" aria-label="Host" />
                            )}
                        {player.socketID === currPlayer.socketID && (
                            <span className="text-xs text-muted-foreground">(you)</span>
                    )}
                    </div>
                </div>
            </li>
            ))}

            {Array.from({ length: emptySlots }).map((_, i) => (
            <li
                key={`empty-${i}`}
                className="flex items-center gap-3 rounded-lg border border-dashed border-border/60 px-3 py-2.5 opacity-50"
            >
                <div
                    className="size-9 shrink-0 rounded-full border border-dashed border-border bg-muted/30"
                    style={{ backgroundColor: `${PLAYER_COLORS[(players.length + i) % PLAYER_COLORS.length]}22` }}
                />
                <span className="text-sm text-muted-foreground">Waiting...</span>
            </li>
            ))}
        </ul>
    </aside>
  );
}

export default LobbyPlayerList
