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

const rooms: Record<string, GameEngine> = {}; // roomCode => class object
const turnTimers: Record<string, ReturnType<typeof setTimeout>> = {};

const clearTurnTimer = (roomCode: string) => {
  const timer = turnTimers[roomCode];
  if (timer) {
    clearTimeout(timer);
    delete turnTimers[roomCode];
  }
};

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
  const gameStarter = (obj: GameEngine, roomCode: string) => {
    obj.newPhase("waiting");
    obj.isScoring = false;

    const drawer = obj.newDrawer();
    if (!drawer) return;

    const words = obj.guessWords();
    obj.wordChoices = words;
    
    io.to(drawer).emit("choose-word", words, Object.values(obj.allPlayers));
    io.to(roomCode).except(drawer).emit("is-choosing", Object.values(obj.allPlayers));
  };

  const handleTurnEnd = (roomCode: string) => {
    clearTurnTimer(roomCode);
    const obj = rooms[roomCode];
    if (!obj || obj.gamePhase !== "draw-and-guess" || obj.isScoring) return;

    obj.isScoring = true;
    obj.setPoints("drawer");
    obj.resetPLayers();

    io.to(roomCode).emit("scores", Object.values(obj.allPlayers));

    if (obj.turnOrder.length === 0 && obj.currentRound === obj.totalRounds) {
      obj.gamePhase = "rounds-over";
      io.to(roomCode).emit("game-over", Object.values(obj.allPlayers));
      return;
    }

    if (obj.turnOrder.length === 0)
      io.to(roomCode).emit("new-round");

    setTimeout(() => {
      gameStarter(obj, roomCode);
    }, 5000);
  };

  const scheduleTurnEnd = (roomCode: string, drawTimeMs: number) => {
    clearTurnTimer(roomCode);
    turnTimers[roomCode] = setTimeout(() => handleTurnEnd(roomCode), drawTimeMs);
  };

  const syncLateJoiner = (socket: Socket, obj: GameEngine) => {
    socket.emit("all-lobby-settings", 
      [{
        settingsName: "totalRounds", settingsVal: obj.totalRounds}, {
        settingsName: "maxPlayers", settingsVal: obj.maxPlayers}, { 
        settingsName: "drawTime", settingsVal: obj.drawTime
      }], obj.currentRound);

    if (obj.gamePhase === "waiting") {
      if (socket.id === obj.currentDrawer) {
        socket.emit("choose-word", obj.wordChoices, Object.values(obj.allPlayers));
      } else {
        socket.emit("is-choosing", Object.values(obj.allPlayers));
      }
      return;
    }

    if (obj.gamePhase === "draw-and-guess") {
      socket.emit("overlay-dismiss", obj.guessWord.length, obj.turnEndsAt, Date.now());
      socket.emit("replay-history", obj.strokeHistory, obj.turnEndsAt, Date.now());
    }
  };

  io.on("connection", (socket) => {
    socket.on("join-room", (roomCode, payload) => {
      if (roomCode in rooms) return;

      payload.isAdmin = true;

      initializePayload(payload, socket, roomCode);
      createRoom(roomCode, payload);

      io.to(roomCode).emit("new-joinee", Object.values(rooms[socket.data.roomCode].allPlayers), payload);
    });

    socket.on("join-created-room", (roomCode, payload) => {
      const obj = rooms[roomCode];
      if (!obj) return;

      if (Object.keys(obj.allPlayers).length >= obj.maxPlayers) return;
      initializePayload(payload, socket, roomCode);

      obj.addPlayer(payload);

      io.to(roomCode).emit("new-joinee", Object.values(obj.allPlayers), payload);
      syncLateJoiner(socket, obj);
    });

    socket.on("settings", (payload) => {
      if (rooms[socket.data.roomCode].allPlayers[socket.id].isAdmin === true) {
        rooms[socket.data.roomCode].setSettings(payload);
        socket.to(payload.roomCode).emit("lobby-settings", payload);
      }
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
          io.to(socket.data.roomCode).emit("correct-guess", {id: payload.id, sender: payload.sender, message: "Guessed Correctly!"}, socket.id, Object.values(obj.allPlayers));
        }
        else
          socket.to(socket.data.roomCode).emit("message-received", payload);
      }
    });

    socket.on("start-game", () => {
      const obj = rooms[socket.data.roomCode];
      if (!obj) return;

      gameStarter(obj, socket.data.roomCode);
    });

    socket.on("word-chosen", (word: string) => {
      const obj = rooms[socket.data.roomCode];
      if (!obj || socket.id !== obj.currentDrawer || obj.gamePhase !== "waiting") return;

      obj.newPhase("draw-and-guess");

      if (word) {
        obj.guessWord = word;
      }

      obj.turnEndsAt = (obj.drawTime * 1000) + Date.now();
      scheduleTurnEnd(socket.data.roomCode, obj.drawTime * 1000);

      io.to(socket.data.roomCode).emit("overlay-dismiss", obj.guessWord.length, obj.turnEndsAt, Date.now());
    });

    socket.on("score-board", () => {
      const obj = rooms[socket.data.roomCode];
      if (!obj || socket.id !== obj.currentDrawer || obj.gamePhase !== "draw-and-guess") return;

      handleTurnEnd(socket.data.roomCode);
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