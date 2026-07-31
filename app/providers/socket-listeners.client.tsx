"use client";

import { socket } from "@/app/socket";
import type { DrawEventPayload, Player } from "@/lib/types/types";
import { useContext, useEffect } from "react";
import { GameStoreContext } from "./game-store-provider";

export function SocketListeners() {
  const store = useContext(GameStoreContext);

  useEffect(() => {
    if (!store) return;

    socket.connect();
    socket.on("connect", () => {
      console.log("connected");
    })

    const onNewJoinee = (players: Player[], payload: Player) => {
      const { newPlayers, newMessage, setCurrPlayer } = store.getState().actions;
      setCurrPlayer({ socketID: socket.id });
      newMessage({
        id: crypto.randomUUID(),
        sender: payload.username,
        message: "Joined",
      });
      newPlayers(players);
    };

    const onLobbySettings = (payload: {
      settingsName: string;
      settingsVal: string | number | boolean;
    }) => {
      store.getState().actions.applyRemoteSettings(payload.settingsName, payload.settingsVal);
    };

    const onMessageReceived = (payload: {id: string, sender: string, message: string}) => {
      store.getState().actions.newMessage(payload);
    }

    const onIsChoosing = (players: Player [], currTime: number, serverNow: number) => {
      store.getState().actions.changeGamePhase();
      store.getState().actions.setClockOffset(serverNow - Date.now());
      store.getState().actions.setTurnEndsAt(currTime);
      const player = players.find((p) => p.isDrawer === true);
      if (player)
        store.getState().actions.setChoosingOverlay(player.username);
      store.getState().actions.newPlayers(players);
    };

    const onWaiting = (words: string[], players: Player [], currTime: number, serverNow: number) => {
      store.getState().actions.changeGamePhase();
      store.getState().actions.setClockOffset(serverNow - Date.now());
      store.getState().actions.setTurnEndsAt(currTime);
      store.getState().actions.setWaitingOverlay(words);
      store.getState().actions.setCurrPlayer({ isDrawer: true });
      store.getState().actions.newPlayers(players);
    };

    const onOverlayDismiss = (blanks: number) => {
      store.getState().actions.clearOverlay();
      if (!store.getState().currPlayer.isDrawer)
        for (let i = 1; i <= blanks; i += 1)
          store.getState().guessWord += "_ ";
    };

    const onCorrectGuess = (payload: {id: string, sender: string, message: string}, sID: string, players: Player[]) => {
      console.log("correct guess");
      if (store.getState().currPlayer.socketID !== sID)
        store.getState().actions.newMessage(payload);
      store.getState().actions.newPlayers(players);
    };

    const onScores = (players: Player[]) => {
      console.log("onScores fired");
      store.getState().actions.newPlayers(players);
      store.setState((state) => ({ 
        overlay: { type: "score-board" },
        guessWord: "",
        currPlayer: { ...state.currPlayer, isDrawer: false, hasCorrectlyGuessed: false}
       }));
 console.log(store.getState().overlay);    };

    const allSettings = (payload: [{settingsName: string, settingsVal: string | number}]) => {
      payload.map((p) => {
        store.getState().actions.applyRemoteSettings(p.settingsName, p.settingsVal);
      })
    };

    const replayForLateJoinee = (payload: DrawEventPayload [], turnEndsAt: number, serverNow: number) => {
      console.log(payload.length);
      console.log("replay reached");
      const clockOffset = serverNow - Date.now();
      store.getState().actions.setClockOffset(clockOffset);
      store.getState().actions.setTurnEndsAt(turnEndsAt);
      store.getState().actions.setHistory(payload);
      store.getState().actions.changeGamePhase();
    };

    const onNewRound = () => {
      store.setState((state) => ({ currentRound: state.currentRound + 1 }));
    };

    const onGameOver = (players: Player []) => {
      players.sort((a, b) => b.score - a.score);
      store.getState().actions.newPlayers(players);
      store.setState({ overlay: { type: "game-over" }});
    };

    const onSyncTurn = (turnEndsAt: number, serverNow: number) => {
      const clockOffset = serverNow - Date.now();
      store.getState().actions.setClockOffset(clockOffset);
      store.getState().actions.setTurnEndsAt(turnEndsAt);
    };

    socket.on("new-joinee", onNewJoinee);
    socket.on("lobby-settings", onLobbySettings);
    socket.on("message-received", onMessageReceived);
    socket.on("is-choosing", onIsChoosing);
    socket.on("choose-word", onWaiting);
    socket.on("overlay-dismiss", onOverlayDismiss);
    socket.on("correct-guess", onCorrectGuess);
    socket.on("scores", onScores);
    socket.on("all-lobby-settings", allSettings);
    socket.on("replay-history", replayForLateJoinee);
    socket.on("new-round", onNewRound);
    socket.on("game-over", onGameOver);
    socket.on("sync-turn", onSyncTurn);


    return () => {
      socket.off("new-joinee", onNewJoinee);
      socket.off("lobby-settings", onLobbySettings);
      socket.off("message-received", onMessageReceived);
      socket.off("is-choosing", onIsChoosing);
      socket.off("choose-word", onWaiting);
      socket.off("overlay-dismiss", onOverlayDismiss);
      socket.off("correct-guess", onCorrectGuess);
      socket.off("scores", onScores);
      socket.off("all-lobby-settings", allSettings);
      socket.off("replay-history", replayForLateJoinee);
      socket.off("new-round", onNewRound);
      socket.off("game-over", onGameOver);
      socket.off("sync-turn", onSyncTurn);

    };
  }, [store]);

  return null;
}
