import next from "next";
import { createServer } from "node:http";
import { Server, type Socket } from "socket.io";
import type { DrawEventPayload, Player } from "./lib/types/types";
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
    obj.addPlayer(payload);
  };
  const initializePayload = (payload: Player, socket: Socket, roomCode: string) => {
    socket.data.roomCode = roomCode;
    socket.join(roomCode);
    payload.socketID = socket.id;
    payload.id = crypto.randomUUID();
  };
  const gameStarter = (obj: GameEngine, socket: Socket) => {
    obj.newPhase("waiting");
    
    const drawer = obj.newDrawer();
    const words = obj.guessWords();
          
    socket.to(drawer).emit("choose-word", words, Object.values(obj.allPlayers)); // to the drawer
    io.to(socket.data.roomCode).except(drawer).emit("is-choosing", Object.values(obj.allPlayers)); // to the guessers
  };

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
      obj.addPlayer(payload);

      io.to(roomCode).emit("new-joinee", Object.values(obj.allPlayers), payload);
      socket.emit("all-lobby-settings", 
        [{
          settingsName: "totalRounds", settingsVal: obj.totalRounds}, {
          settingsName: "maxPlayers", settingsVal: obj.maxPlayers}, { 
          settingsName: "drawTime", settingsVal: obj.drawTime
        }]);

      if (obj.gamePhase === "draw-and-guess") {
        socket.emit("overlay-dismiss", obj.guessWord.length);
        socket.emit("replay-history", obj.strokeHistory);
      }
    });

    socket.on("settings", (payload) => {
      rooms[socket.data.roomCode].setSettings(payload);
      socket.to(payload.roomCode).emit("lobby-settings", payload);
    });

    socket.on("new-message", (payload) => {
      const obj = rooms[socket.data.roomCode];
      if (obj.currentDrawer !== socket.id)
      {
        if (
          payload.message.toLowerCase() === obj.guessWord.toLowerCase() && 
          obj.gamePhase === "draw-and-guess" && 
          obj.allPlayers[socket.id].hasCorrectlyGuessed === false
        ) {
          obj.setPoints("guesser", payload.minutes, payload.seconds, socket.id);
          io.to(socket.data.roomCode).emit("correct-guess", payload, socket.id, Object.values(obj.allPlayers));
        }
        else
          socket.to(socket.data.roomCode).emit("message-received", payload);
      }
    });

    socket.on("start-game", () => {
      const obj = rooms[socket.data.roomCode];
      gameStarter(obj, socket);
    });

    socket.on("word-chosen", (word: string) => {
      const obj = rooms[socket.data.roomCode];
      obj.newPhase("draw-and-guess");

      if (word)
        obj.guessWord = word;

      io.to(socket.data.roomCode).emit("overlay-dismiss", obj.guessWord.length);
    });

    socket.on("new-turn", () => {
    });

    socket.on("score-board", () => {
      const obj = rooms[socket.data.roomCode];
      obj.setPoints("drawer");
      obj.resetPLayers();
      io.to(socket.data.roomCode).emit("scores", Object.values(obj.allPlayers));
      // socket.emit("scores", Object.values(obj.allPlayers));

      setTimeout(() => {
        gameStarter(obj, socket);
      }, 5000);    
    });

    socket.on("draw-event", (payload: DrawEventPayload) => {
      const obj = rooms[socket.data.roomCode];
      if (obj.allPlayers[socket.id].isDrawer) {
        socket.to(socket.data.roomCode).emit("draw-event", payload);
        obj.addToHistory(payload);
      }
    });

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