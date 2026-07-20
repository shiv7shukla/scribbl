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
};

export type privatePayload = {
  	guessWord: string;
};


export type gameActions = {
	applyRemoteSettings: (settingsName: string, settingsVal: string | number | boolean) => void;
	newMessage: (newMsg: {id: string, sender: string, message: string}) => void;
	incrementRound: () => void;
	changeGamePhase: () => void;
	enterRoom: (payload: Player, admin: boolean) => void;
	setDrawTime: (time: number) => void;
	setRoomCode: (roomCode: string) => void;
	setUserName: (username: string) => void;
	setTotalRounds: (totalRounds: number) => void;
	setMaxPlayers: (maxPlayers: number) => void;
	newPlayers: (newPlayers: Player []) => void;
	setCurrPlayer: (updatedFields: Partial<Player>) => void;
	sendLobbySettings: (settingsName: Partial<LobbySettings>, settingsVal: string | number | boolean) => void;
	sendNewMessage: (payload: {id: string, sender: string, message: string}) => void;
};

export type gameStore = sharedGameState & privatePayload & {actions: gameActions};