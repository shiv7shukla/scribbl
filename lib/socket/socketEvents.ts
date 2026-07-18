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
    const { newPlayers, setCurrPlayer, applyRemoteSettings } = useGameStore((state) => state.actions);

    useEffect(() => {
        socket.connect();
        socket.on("new-joinee", (payload: Player[]) => {
            setCurrPlayer({ socketID: socket.id })
            newPlayers(payload);
        });
        socket.on("permanent-ID", (ID: string) => {
            sessionStorage.setItem("PlayerID", ID);
        });
        socket.on("lobby-settings", (payload) => {
            switch(payload.settingsName){
                case "drawTime":
                    applyRemoteSettings(payload.settingsName, payload.settingsVal);
                break;
                case "maxPlayers":
                    applyRemoteSettings(payload.settingsName, payload.settingsVal);
                    console.log("received", payload.settingsVal);
                break;
                case "totalRounds":
                    applyRemoteSettings(payload.settingsName, payload.settingsVal);
                break;
            }
        })
    }, []);
}