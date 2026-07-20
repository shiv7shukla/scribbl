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

    const onNewJoinee = (players: Player[], payload: Player) => {
      const { newPlayers, newMessage, setCurrPlayer } = store.getState().actions;
      console.log("CLIENT received new-joinee:", players, "from", payload.username);
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
      settingsVal: unknown;
    }) => {
      store.getState().actions.applyRemoteSettings(payload.settingsName, payload.settingsVal);
    };

    socket.on("new-joinee", onNewJoinee);
    socket.on("lobby-settings", onLobbySettings);

    return () => {
      socket.off("new-joinee", onNewJoinee);
      socket.off("lobby-settings", onLobbySettings);
    };
  }, [store]);

  return null;
}
