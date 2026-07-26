import type { DrawingEngine } from "../drawingcanvas/DrawingEngine";

export type ChatMessage = {
	id: string;
	author: string;
	color: string;
	text: string;
};

export type LobbySettings = {
	totalRounds: number;
	drawTime: number;
	maxPlayers: number;
	customWords: string;
	useCustomWordsOnly: boolean;
	hints: number;
};

export type mouseEvents = "mousedown" | "mousemove" | "mouseup" | "mouseout" | "clear";

export type MouseEventPayload = {
	type: mouseEvents; 
	x: number;
	y: number;
};

export type BrushEventPayload = {
	type: "setbrush";
	color: string;
	size: number;
}

export type DrawEventPayload = MouseEventPayload | BrushEventPayload;

export type Player = { 
	id: string,
	username: string, 
	color: string, 
	score: number, 
	socketID: string, 
	isAdmin: boolean, 
	hasCorrectlyGuessed: boolean, 
	isDrawer: boolean 
};

export type sharedGameState = {
	roomCode: string;
	messages: { id: string, sender: string, message: string }[];
	totalRounds: number;
	currentRound: number;
	maxPlayers: number;
	players: Player [];
	currPlayer: Player;
	gamePhase: string;
	drawTime: number;
	minutes: number;
	seconds: number;
	strokeHistory: DrawEventPayload [];      
};

export type gameOverlayState =
	| { type: null }
	| { type: "is-choosing"; username: string }
	| { type: "waiting"; words: string[] }
	| { type: "score-board"};

export type privatePayload = {
  	guessWord: string;
	overlay: gameOverlayState;
};

export type gameActions = {
	newTurn: () => void;
	startGame: () => void;
	scoreBoard: () => void;
	clearOverlay: () => void;
	incrementRound: () => void;
	changeGamePhase: () => void;
	setDrawTime: (time: number) => void;
	setRoomCode: (roomCode: string) => void;
	setUserName: (username: string) => void;
	submitWordChoice: (word: string) => void;
	setMaxPlayers: (maxPlayers: number) => void;
	newPlayers: (newPlayers: Player []) => void;
	setWaitingOverlay: (words: string[]) => void;
	markCorrectGuess: (socketID: string) => void;
	setTime: (time: string, val: number) => void;
	setTotalRounds: (totalRounds: number) => void;
	setChoosingOverlay: (username: string) => void;
	enterRoom: (payload: Player, admin: boolean) => void;
	setCurrPlayer: (updatedFields: Partial<Player>) => void;
	setHistory: (payload: DrawEventPayload []) => void;
	newMessage: (newMsg: {id: string, sender: string, message: string}) => void;
	applyRemoteSettings: (settingsName: string, settingsVal: string | number | boolean) => void;
	// sendLobbySettings: (settingsName: Partial<LobbySettings>, settingsVal: string | number | boolean) => void;
	sendNewMessage: (payload: {id: string, sender: string, message: string, minutes: number, seconds: number}) => void;
};

export type gameStore = sharedGameState & privatePayload & {actions: gameActions};