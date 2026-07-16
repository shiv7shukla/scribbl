import { gameState, gameStore } from "@/lib/types/types";
import { createStore } from "zustand";

export const defaultInitState: gameState = {
    roomCode: "",
    messages: [],
    totalRounds: 3,
    currentRound: 1,
    maxPlayers: 8,
    players: [],
    gamePhase: "lobby",
    drawTime: 80
}

export const createGameStore = ( initState: gameState = defaultInitState ) => {
    return createStore<gameStore>()((set) => ({
        ...initState,
        changeGamePhase: () => set((state) => ({ gamePhase: "gaming" })),
        setDrawTime: (drawTime) => set((state) => ({ drawTime: drawTime})),
        setMaxPlayers: (maxPlayers) => set((state) => ({ maxPlayers: maxPlayers })),
        setTotalRounds: (totalRounds) => set((state) => ({ totalRounds: totalRounds })),
        incrementRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
        newMessage: (newMsg) => set((state) => ({ messages: [...state.messages, ...newMsg] })),
        newPlayers: (newPlayer) => set((state) => ({ players: [...state.players, ...newPlayer]})),
    }))
}