import { SmoothBrush } from "./SmoothBrush";

export class DrawingEngine {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    public isDrawing: boolean;
    public lastX: number;
    public lastY: number;
    public smoothBrush: SmoothBrush;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // Default brush settings
        this.smoothBrush = new SmoothBrush(canvas);
        if (this.smoothBrush.ctx){
            this.smoothBrush.ctx.strokeStyle = "#000000";
            this.smoothBrush.ctx.lineWidth = 3;
            this.smoothBrush.ctx.globalAlpha = 1;
        }
        this.setupEventListeners();
        this.configureContext();
    }

    configureContext() {
        if (!this.ctx) return;

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.imageSmoothingEnabled = true;

        if (this.smoothBrush.ctx) {
            this.smoothBrush.ctx.lineCap = "round";
            this.smoothBrush.ctx.lineJoin = "round";
        }
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
        this.canvas.addEventListener("mousemove", (e) => this.draw(e));
        this.canvas.addEventListener("mouseup", () => this.stopDrawing());
        this.canvas.addEventListener("mouseout", () => this.stopDrawing());

        // Touch events for mobile support
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener("touchend", () => this.stopDrawing());
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const { x, y } = this.getCoordinates(e);
        this.lastX = x;
        this.lastY = y;

        // Start a new path
        if (!this.ctx) return;

        this.smoothBrush.reset();
        this.smoothBrush.addPoint(x, y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        if (!this.ctx) return;

        const { x, y } = this.getCoordinates(e);

        this.smoothBrush.addPoint(x, y);
    }

    stopDrawing() {
        if (this.isDrawing && this.ctx) {
            this.isDrawing = false;
            this.smoothBrush.reset();
        }
    }

    setBrush(color: string, size: number, opacity = 1) {
        if (this.smoothBrush.ctx) {
            this.smoothBrush.ctx.strokeStyle = color;
            this.smoothBrush.ctx.lineWidth = size;
            this.smoothBrush.ctx.globalAlpha = opacity;
        }
    }

    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}