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