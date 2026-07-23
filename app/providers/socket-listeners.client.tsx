"use client";

import { socket } from "@/app/socket";
import type { Player } from "@/lib/types/types";
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
      console.log(payload);
      store.getState().actions.newMessage(payload);
    }

    const onIsChoosing = (player: Player) => {
      store.getState().actions.changeGamePhase();
      store.getState().actions.setChoosingOverlay(player.username);
      const drawer = store.getState().players.find(p => p.socketID === player.socketID);
      if (drawer)
        drawer.isDrawer = true;
    };

    const onWaiting = (words: string[]) => {
      store.getState().actions.changeGamePhase();
      store.getState().actions.setWaitingOverlay(words);
      store.getState().actions.setCurrPlayer({ isDrawer: true });
    };

    const onOverlayDismiss = (blanks: number) => {
      store.getState().actions.clearOverlay();
      if (!store.getState().currPlayer.isDrawer)
        for (let i = 1; i <= blanks; i += 1)
          store.getState().guessWord += "_ ";
    };

    socket.on("new-joinee", onNewJoinee);
    socket.on("lobby-settings", onLobbySettings);
    socket.on("message-received", onMessageReceived);
    socket.on("is-choosing", onIsChoosing);
    socket.on("choose-word", onWaiting);
    socket.on("overlay-dismiss", onOverlayDismiss);

    return () => {
      socket.off("new-joinee", onNewJoinee);
      socket.off("lobby-settings", onLobbySettings);
      socket.off("message-received", onMessageReceived);
      socket.off("is-choosing", onIsChoosing);
      socket.off("choose-word", onWaiting);
      socket.off("overlay-dismiss", onOverlayDismiss);
    };
  }, [store]);

  return null;
}
