import { gameState, gameStore } from "@/lib/types/types";
import { createStore } from "zustand";

export const defaultInitState: gameState = {
    roomCode: "",
    messages: [],
    totalRounds: 3,
    currentRound: 1,
    maxPlayers: 8,
    players: [],
}

export const createGameStore = ( initState: gameState = defaultInitState ) => {
    return createStore<gameStore>()((set) => ({
        ...initState,
        newMessage: (newMsg) => set((state) => ({ messages: [...state.messages, ...newMsg] })),
        incrementRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
        newPlayers: (newPlayer) => set((state) => ({ players: [...state.players, ...newPlayer]}))
    }))
}