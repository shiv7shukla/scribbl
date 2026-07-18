import next from "next";
import { createServer } from "node:http";
import { Server, type Socket } from "socket.io";
import type { Player } from "./lib/types/types";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, { transports: ["websocket"] });
  const players: Player[] = [];
  const roomCode: String = "";

  const initializePayload = ( payload: Player, socket: Socket, roomCode: string ) => {
    payload.socketID = socket.id;
    socket.join(roomCode);
    players.push(payload);
}

  io.on("connection", (socket) => {
    console.log("server connected");
    socket.on("join-room", (roomCode, payload) => {
      initializePayload(payload, socket, roomCode);
      payload.isAdmin = true;
      io.to(roomCode).emit("new-joinee", players);
      socket.emit("permanent-ID", String(crypto.randomUUID()))
    });

    socket.on("join-created-room", (roomCode, payload) => {
      initializePayload(payload, socket, roomCode);
      io.to(roomCode).emit("new-joinee", players);
      socket.emit("permanent-ID", String(crypto.randomUUID()))
    });

    socket.on("settings", (payload) => {
      socket.to(payload.roomCode).emit("lobby-settings", payload);
      console.log("socket sent");
    })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});