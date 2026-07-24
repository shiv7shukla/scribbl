import { gameStore, privatePayload, sharedGameState } from "@/lib/types/types";
import { createStore } from "zustand";
import { socket } from "../socket";

export const defaultInitState: sharedGameState & privatePayload = {
    roomCode: "",
    messages: [],
    totalRounds: 3,
    currentRound: 1,
    maxPlayers: 8,
    players: [],
    gamePhase: "lobby",
    drawTime: 80,
    guessWord: "",
    overlay: { type: null },
    currPlayer: {
        id: "",
        username: "",
        color: "#000000",
        score: 0,
        socketID: "",
        isAdmin: false, 
        hasCorrectlyGuessed: false, 
        isDrawer: false 
    }
}

export const createGameStore = ( initState: sharedGameState & privatePayload = defaultInitState ) => {
    return createStore<gameStore>()((set, get) => ({
        ...initState,
        actions: {
            clearOverlay: () => set({ overlay: { type: null } }),
            incrementRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
            
            setRoomCode: (roomCode) => set((state) => ({ roomCode: roomCode })),
            newPlayers: (newPlayers) => set((state) => ({ players: newPlayers })),
            applyRemoteSettings: (settingsName, settingsVal) => set((state) => ({ [settingsName]: settingsVal })),

            setWaitingOverlay: (words) => set({ overlay: { type: "waiting", words } }),
            newMessage: (newMsg) => set((state) => ({ messages: [...state.messages, newMsg] })),
            setChoosingOverlay: (username) => set({ overlay: { type: "is-choosing", username } }),
            setUserName: (username) => set((state) => ({ currPlayer: { ...state.currPlayer, username }})),
            setCurrPlayer: (updatedFields) => set((state) => ({ currPlayer: state.currPlayer? { ...state.currPlayer, ...updatedFields } : state.currPlayer })),
            changeGamePhase: () => set((state) => ({ gamePhase: "gaming" })),
            markCorrectGuess: (socketID: string) => set((state) => ({ players: state.players.map((p) => p.socketID === socketID ? { ...p, hasCorrectlyGuessed: true } : p )})),

            startGame: () => { socket.emit("start-game"); },

            setMaxPlayers: (maxPlayers) => { 
                set((state) => ({ maxPlayers: maxPlayers })); 
                socket.emit("settings", {roomCode: get().roomCode, settingsName: "maxPlayers", settingsVal: maxPlayers});
            },

            setDrawTime: (drawTime) => {
                set((state) => ({ drawTime: drawTime}));
                socket.emit("settings", {roomCode: get().roomCode, settingsName: "drawTime", settingsVal: drawTime});
            },

            setTotalRounds: (totalRounds) => {
                set((state) => ({ totalRounds: totalRounds }))
                socket.emit("settings", {roomCode: get().roomCode, settingsName: "totalRounds", settingsVal: totalRounds});
            },

            enterRoom: (payload, admin) => { 
                if(admin) 
                    socket.emit("join-room", get().roomCode, payload);
                else
                    socket.emit("join-created-room", get().roomCode, payload);
            },

            sendLobbySettings: (settingsName, settingsVal) => {
                socket.emit("settings", {settingsName, settingsVal});
            },

            sendNewMessage: (payload: {id: string, sender: string, message: string}) => {
                socket.emit("new-message", payload);
            },            

            submitWordChoice: (word) => {
                socket.emit("word-chosen", word);
                set({ overlay: { type: null }, guessWord: word });
            },
        }
    }))
}