import { gameStore, identityPayload, privatePayload, sharedGameState } from "@/lib/types/types";
import { createStore } from "zustand";
import { socket } from "../socket";

export const defaultInitState: sharedGameState & privatePayload & identityPayload = {
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
    currPlayer: {
        username: "",
        color: "#000000",
        score: 0,
        socketID: "",
        isAdmin: false, 
        hasCorrectlyGuessed: false, 
        isDrawer: false 
    }
}


export const createGameStore = ( initState: sharedGameState & privatePayload & identityPayload = defaultInitState ) => {
    return createStore<gameStore>()((set, get) => ({
        ...initState,
        actions: {
            changeGamePhase: () => set((state) => ({ gamePhase: "gaming" })),
            setDrawTime: (drawTime) => set((state) => ({ drawTime: drawTime})),
            setRoomCode: (roomCode) => set((state) => ({ roomCode: roomCode })),
            newPlayers: (newPlayers) => set((state) => ({ players: newPlayers })),
            setMaxPlayers: (maxPlayers) => set((state) => ({ maxPlayers: maxPlayers })),
            enterRoom: (payload) => { socket.emit("join-room", get().roomCode, payload) },
            setTotalRounds: (totalRounds) => set((state) => ({ totalRounds: totalRounds })),
            incrementRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
            newMessage: (newMsg) => set((state) => ({ messages: [...state.messages, ...newMsg] })),
            setUserName: (username) => set((state) => ({ currPlayer: { ...state.currPlayer, username }})),
            setCurrPlayer: (updatedFields) => set((state) => ({ currPlayer: state.currPlayer? { ...state.currPlayer, ...updatedFields } : state.currPlayer })),
        }
    }))
}