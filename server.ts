import next from "next";
import { createServer } from "node:http";
import { Server, type Socket } from "socket.io";
import type { Player } from "./lib/types/types";
import { GameEngine } from "./lib/gamelogic/GameEngine";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export const rooms: Record<string, GameEngine> = {}; // roomCode => class object

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, { transports: ["websocket"] });
  const createRoom = (roomCode: string, payload: Player) => {
    const obj = new GameEngine();
    rooms[roomCode] = obj;
    obj.roomCode = roomCode;
    obj.adminId = payload.socketID;
    obj.allPlayers[payload.socketID] = payload;
    obj.formQueue();
  }
  const initializePayload = (payload: Player, socket: Socket, roomCode: string) => {
    socket.data.roomCode = roomCode;
    socket.join(roomCode);
    payload.socketID = socket.id;
    payload.id = crypto.randomUUID();
  }

  io.on("connection", (socket) => {
    socket.on("join-room", (roomCode, payload) => {
      payload.isAdmin = true;
      initializePayload(payload, socket, roomCode);
      createRoom(roomCode, payload);
      io.to(roomCode).emit("new-joinee", Object.values(rooms[socket.data.roomCode].allPlayers), payload);
    });

    socket.on("join-created-room", (roomCode, payload) => {
      initializePayload(payload, socket, roomCode);
      const obj = rooms[roomCode];
      obj.allPlayers[payload.socketID] = payload;
      obj.formQueue();
      io.to(roomCode).emit("new-joinee", Object.values(rooms[socket.data.roomCode].allPlayers), payload);
    });

    socket.on("settings", (payload) => {
      rooms[socket.data.roomCode].setSettings(payload);
      socket.to(payload.roomCode).emit("lobby-settings", payload);
    });

    socket.on("new-message", (payload) => {
      socket.to(socket.data.roomCode).emit("message-received", payload);
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