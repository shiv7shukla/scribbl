export type Player = {
  id: string;
  name: string;
  color: string;
  isHost: boolean;
  score: number;
};

export type ChatMessage = {
  id: string;
  author: string;
  color: string;
  text: string;
};

export type LobbySettings = {
  rounds: number;
  drawTime: number;
  maxPlayers: number;
  customWords: string;
  useCustomWordsOnly: boolean;
  hints: number;
};

export type gameState = {
  roomCode: string;
  messages: {sender: string, message: string}[];
  totalRounds: number;
  currentRound: number;
  maxPlayers: number;
  players: {username: string, color: string}[];
  gamePhase: string;
  drawTime: number;
};

export type gameActions = {
  newMessage: (newMsg: {sender: string, message: string} []) => void;
  incrementRound: () => void;
  changeGamePhase: () => void;
  setDrawTime: (time: number) => void;
  setTotalRounds: (totalRounds: number) => void;
  setMaxPlayers: (maxPlayers: number) => void;
  newPlayers: (newPlayer: {username: string, color: string} []) => void;
};

export type gameStore = gameState & gameActions;