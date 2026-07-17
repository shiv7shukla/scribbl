import { useGameStore } from "@/app/providers/game-store-provider";
import { socket } from "@/app/socket";
import { useEffect } from "react"
import { useShallow } from "zustand/shallow";
import type { Player } from "../types/types";

export const useSocketListeners = () => {
    const { players, currPlayer } = useGameStore(useShallow((state) => ({
        players: state.players,
        currPlayer: state.currPlayer
    })));
    const { newPlayers, setCurrPlayer } = useGameStore((state) => state.actions);

    useEffect(() => {
        socket.connect();
        socket.on("new-joinee", (payload: Player[]) => {
            setCurrPlayer({ socketID: socket.id })
            newPlayers(payload);
        });
        socket.on("permanent-ID", (ID: string) => {
            sessionStorage.setItem("PlayerID", ID);
        })
    }, []);
}