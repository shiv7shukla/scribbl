"use client";

import { useContext, useEffect } from "react";
import { socket } from "@/app/socket";
import type { Player } from "@/lib/types/types";
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
      console.log("CLIENT received new-joinee:", players, "from", payload.username);
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

    socket.on("new-joinee", onNewJoinee);
    socket.on("lobby-settings", onLobbySettings);
    socket.on("message-received", onMessageReceived);

    return () => {
      socket.off("new-joinee", onNewJoinee);
      socket.off("lobby-settings", onLobbySettings);
    };
  }, [store]);

  return null;
}
