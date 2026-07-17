import { gameStore, sharedGameState } from "@/lib/types/types";
import { createStore } from "zustand";

export const defaultInitState: sharedGameState = {
    roomCode: "",
    messages: [],
    totalRounds: 3,
    currentRound: 1,
    maxPlayers: 8,
    players: [],
    gamePhase: "lobby",
    drawTime: 80,
    guessWord: "",
    playerID: "",
}

export const createGameStore = ( initState: sharedGameState = defaultInitState ) => {
    return createStore<gameStore>()((set) => ({
        ...initState,
        actions: {
            changeGamePhase: () => set((state) => ({ gamePhase: "gaming" })),
            setDrawTime: (drawTime) => set((state) => ({ drawTime: drawTime})),
            setMaxPlayers: (maxPlayers) => set((state) => ({ maxPlayers: maxPlayers })),
            setTotalRounds: (totalRounds) => set((state) => ({ totalRounds: totalRounds })),
            setRoomCode: (roomCode) => set((state) => ({ roomCode: roomCode })),
            incrementRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
            newMessage: (newMsg) => set((state) => ({ messages: [...state.messages, ...newMsg] })),
            newPlayers: (newPlayer) => set((state) => ({ players: [...state.players, ...newPlayer]})),
        }
    }))
}