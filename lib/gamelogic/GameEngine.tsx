import { DrawEventPayload, Player } from "../types/types";
import { wordBank } from "../wordBank";

export class GameEngine{
    public roomCode: string;
    public allPlayers: Record<string, Player>; // socketId => Player Object
    public turnOrder: string [];             
    public currentDrawer: string;           
    public adminId: string;                 
    public guessWord: string;               
    public strokeHistory: DrawEventPayload [];      
    public gamePhase: "lobby" | "waiting" | "draw-and-guess" | "rounds-over";
    public currentRound: number;
    public totalRounds: number;
    public drawTime: number;                
    public maxPlayers: number;
    public turnEndsAt: number;
    public wordChoices: string[];
    public isScoring: boolean;

    public calcGueserPoints (timeRemaining: number, drawTime: number) {
        const basePoints = 50;
        const bonusPoints = 50;
        const timeRatio = timeRemaining / drawTime; 
        return Math.round(basePoints + bonusPoints * timeRatio);
    };

    public calculateDrawerPoints () {
        const totalGuessers = Object.keys(this.allPlayers).length - 1;
        const correctGuessCount = Object.values(this.allPlayers).reduce((count, p) => {
            return p.hasCorrectlyGuessed === true ? count + 1: count
        }, 0);
        if (totalGuessers === 0) return 0;
        const maxDrawerPoints = 100;
        return Math.round(maxDrawerPoints * (correctGuessCount / totalGuessers));
    };

    public formQueue () {
        this.turnOrder = Array.from(Object.keys(this.allPlayers));
    };

    public setSettings (payload: {
      settingsName: string;
      settingsVal: string | number | boolean;
    }) {
        switch(payload.settingsName){
            case "totalRounds":
                if (typeof payload.settingsVal == "number")
                    this.totalRounds = payload.settingsVal;
                break;
            case "maxPlayers":
                if (typeof payload.settingsVal == "number")
                    this.maxPlayers = payload.settingsVal;
                break;
            case "drawTime":
                if (typeof payload.settingsVal == "number")
                    this.drawTime = payload.settingsVal;
                break;
        }
    };

    public newPhase (newPhase: "lobby" | "waiting" | "draw-and-guess" | "rounds-over") {
        this.gamePhase = newPhase;
    };

    public newDrawer (): string {
        // if (this.turnOrder.length === 0 && this.currentRound !== this.totalRounds) {
        //     this.formQueue();
        //     this.currentRound += 1;
        //     // if (this.currentRound === this.totalRounds) {

        //     // }
        // }

        // else if (this.currentRound === this.totalRounds) {
        //     // this.gamePhase = "rounds-over";
        //     return "";
        // }

        if (this.turnOrder.length === 0) {
            this.formQueue();
            if (this.currentRound !== this.totalRounds) {
                this.currentRound += 1;
            }
            else if (this.currentRound === this.totalRounds) {
                return "";
            }
        }
        
        const drawer = this.turnOrder.pop();
        if (drawer) {
            this.currentDrawer = drawer;
            this.allPlayers[this.currentDrawer].isDrawer = true;
        }
        return this.currentDrawer;
    };

    public guessWords (): string[] {
        const pickedIndices = new Set();
        const res: string[] = [];

        while (pickedIndices.size < 3) {
            const randomIndex = Math.floor(Math.random() * wordBank.length);

            if (!pickedIndices.has(randomIndex)) {
                pickedIndices.add(randomIndex);
                res[pickedIndices.size - 1] = wordBank[randomIndex];
            }
        }

        this.guessWord = res[0];
        return res;
    };

    public setPoints (role: "guesser" | "drawer", minutes?: number, seconds?: number, socketId?: string) {
        if (role === "guesser" && minutes !== undefined && seconds !== undefined && socketId !== undefined) {
            const time = (minutes * 60) + seconds;
            this.allPlayers[socketId].score += this.calcGueserPoints(time, this.drawTime);
            this.allPlayers[socketId].hasCorrectlyGuessed = true;
        }
        else if (role === "drawer") {
            this.allPlayers[this.currentDrawer].score += this.calculateDrawerPoints();
        }
    };

    public addToHistory (payload: DrawEventPayload) {
        this.strokeHistory.push(payload);
    };

    public resetPLayers () {
        this.strokeHistory = [];
        if (this.currentDrawer !== "")
            this.allPlayers[this.currentDrawer].isDrawer = false;

        const players = Object.fromEntries((Object.entries(this.allPlayers) as [string, Player] []).map(([k, v]) => {
            return [k, {...v, hasCorrectlyGuessed: false}];
        })) as Record<string, Player>;

        this.allPlayers = players;
    };

    public addPlayer (player: Player) {
        this.allPlayers[player.socketID] = player;
        this.turnOrder.push(player.socketID);
    }

    constructor(){
        this.roomCode = "";
        this.adminId = "";
        this.guessWord = "";
        this.currentDrawer = "";
        this.gamePhase = "lobby";
        this.drawTime = 80;
        this.totalRounds = 3;
        this.maxPlayers = 8;
        this.currentRound = 1;
        this.turnEndsAt = 0;
        this.turnOrder = [];
        this.strokeHistory = [];
        this.allPlayers = {};
        this.wordChoices = [];
        this.isScoring = false;
    }

}