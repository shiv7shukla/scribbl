"use client";

import { socket } from "@/app/socket";
import type { DrawEventPayload, Player } from "@/lib/types/types";
import { useContext, useEffect } from "react";
import { GameStoreContext } from "./game-store-provider";
import { canvasStrokes } from "@/lib/utils";

export function SocketListeners() {
  const store = useContext(GameStoreContext);

  useEffect(() => {
    if (!store) return;

    socket.connect();
    socket.on("connect", () => {
      console.log("connected");
    })

    const onNewJoinee = (players: Player[], payload: Player) => {
      console.log(players);
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

    const onIsChoosing = (players: Player []) => {
      store.getState().actions.changeGamePhase();
      const player = players.find((p) => p.isDrawer === true);
      if (player)
        store.getState().actions.setChoosingOverlay(player.username);
      store.getState().actions.newPlayers(players);
    };

    const onWaiting = (words: string[], players: Player []) => {
      store.getState().actions.changeGamePhase();
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
      if (store.getState().currPlayer.socketID !== sID)
        store.getState().actions.newMessage(payload);
      console.log(players);
      store.getState().actions.newPlayers(players);
    };

    const onScores = (players: Player[]) => {
      store.getState().actions.newPlayers(players);
    };

    const allSettings = (payload: [{settingsName: string, settingsVal: string | number}]) => {
      payload.map((p) => {
        store.getState().actions.applyRemoteSettings(p.settingsName, p.settingsVal);
      })
    };

    const replayForLateJoinee = (payload: DrawEventPayload []) => {
      store.getState().actions.changeGamePhase();
      store.getState().actions.setHistory(payload);
    }

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

    };
  }, [store]);

  return null;
}
