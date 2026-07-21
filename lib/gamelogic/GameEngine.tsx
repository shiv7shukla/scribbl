import { rooms } from "@/server";
import { Player } from "../types/types";

export class GameEngine{
    public roomCode: string;
    public allPlayers: Record<string, Player>;              
    public turnOrder: string[];             
    public currentDrawer: string;           
    public adminId: string;                 
    public guessWord: string;               
    // public strokeHistory: DrawEvent[];      
    public gamePhase: "lobby" | "waiting" | "draw-and-guess" | "rounds-over";
    public currentRound: number;
    public totalRounds: number;
    public drawTime: number;                
    public maxPlayers: number;

    public calcGueserPoints(timeRemaining: number, drawTime: number) {
        const basePoints = 50;
        const bonusPoints = 50;
        const timeRatio = timeRemaining / drawTime; 
        return Math.round(basePoints + bonusPoints * timeRatio);
    };

    public calculateDrawerPoints(correctGuessCount: number, totalGuessers: number) {
        if (totalGuessers === 0) return 0;
        const maxDrawerPoints = 100;
        return Math.round(maxDrawerPoints * (correctGuessCount / totalGuessers));
    };

    public formQueue() {
        this.turnOrder = Array.from(Object.keys(this.allPlayers));
    };

    constructor(){
        this.roomCode = "";
        this.adminId = "";
        this.guessWord = "";
        this.currentDrawer = "";
        this.gamePhase = "lobby";
        this.drawTime = 180;
        this.totalRounds = 8;
        this.maxPlayers = 16;
        this.currentRound = 1;
        this.turnOrder = [];
        this.allPlayers = {};
    }

}