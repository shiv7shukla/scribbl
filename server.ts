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

const rooms: Record<string, Player[]> = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, { transports: ["websocket"] });
  const players: Player[] = [];
  let roomCode: string;

  const initializePayload = ( payload: Player, socket: Socket, rc: string ) => {
    roomCode = rc;
    payload.socketID = socket.id;
    payload.id = crypto.randomUUID();
    socket.join(roomCode);
    players.push(payload);
  }

  // const initializePayload = (payload: Player, socket: Socket, roomCode: string) => {
  //   payload.id = crypto.randomUUID();
  //   console.log("JOIN ATTEMPT:", { socketId: socket.id, roomCode, playerId: payload.id });
  //   payload.socketID = socket.id;
  //   socket.join(roomCode);
  //   if (!rooms[roomCode]) rooms[roomCode] = [];
  //   rooms[roomCode].push(payload);
  //   players.push(payload);
  //   console.log("PLAYERS AFTER PUSH:", players.map(p => ({ id: p.id, socketID: p.socketID })));
  // };

  io.on("connection", (socket) => {
    socket.on("join-room", (roomCode, payload) => {
      payload.isAdmin = true;
      initializePayload(payload, socket, roomCode);
      console.log("EMITTING to room:", roomCode, "sockets in room:", io.sockets.adapter.rooms.get(roomCode)?.size);
      io.to(roomCode).emit("new-joinee", players, payload);
      // io.to(roomCode).emit("new-joinee", rooms[roomCode], payload);
    });

    socket.on("join-created-room", (roomCode, payload) => {
      initializePayload(payload, socket, roomCode);
      console.log("EMITTING to room:", roomCode, "sockets in room:", io.sockets.adapter.rooms.get(roomCode)?.size);
      io.to(roomCode).emit("new-joinee", players, payload);
      // io.to(roomCode).emit("new-joinee", rooms[roomCode], payload);
    });

    socket.on("settings", (payload) => {
      socket.to(payload.roomCode).emit("lobby-settings", payload);
    });

    socket.on("new-message", (payload) => {
      console.log(payload);
      socket.to(roomCode).emit("message-received", payload);
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