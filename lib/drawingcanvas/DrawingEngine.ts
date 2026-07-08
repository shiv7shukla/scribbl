import { SmoothBrush } from "./SmoothBrush";

export class DrawingEngine {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    public isDrawing: boolean;
    public lastX: number;
    public lastY: number;
    public smoothBrush: SmoothBrush;

    private onMouseDown!: (e: MouseEvent) => void;
    private onMouseMove!: (e: MouseEvent) => void;
    private onMouseUp!: () => void;
    private onMouseOut!: () => void;
    private onTouchStart!: (e: TouchEvent) => void;
    private onTouchMove!: (e: TouchEvent) => void;
    private onTouchEnd!: () => void;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.smoothBrush = new SmoothBrush(canvas);

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
        this.onMouseDown = (e) => this.startDrawing(e);
        this.onMouseMove = (e) => this.draw(e);
        this.onMouseUp = () => this.stopDrawing();
        this.onMouseOut = () => this.stopDrawing();

        this.onTouchStart = (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        };
        this.onTouchMove = (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        };
        this.onTouchEnd = () => this.stopDrawing();

        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
        this.canvas.addEventListener("mouseout", this.onMouseOut);

        this.canvas.addEventListener("touchstart", this.onTouchStart);
        this.canvas.addEventListener("touchmove", this.onTouchMove);
        this.canvas.addEventListener("touchend", this.onTouchEnd);
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("mouseout", this.onMouseOut);

        this.canvas.removeEventListener("touchstart", this.onTouchStart);
        this.canvas.removeEventListener("touchmove", this.onTouchMove);
        this.canvas.removeEventListener("touchend", this.onTouchEnd);
    }

    getCoordinates(e: MouseEvent | Touch) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    startDrawing(e: MouseEvent | Touch) {
        this.isDrawing = true;
        const { x, y } = this.getCoordinates(e);
        this.lastX = x;
        this.lastY = y;

        // Start a new path
        if (!this.ctx) return;

        this.smoothBrush.addPoint(x, y);
        this.smoothBrush.reset();
    }

    draw(e: MouseEvent | Touch) {
        if (!this.isDrawing) return;
        if (!this.ctx) return;

        const { x, y } = this.getCoordinates(e);

        this.smoothBrush.addPoint(x, y);
    }

    stopDrawing() {
        if (this.isDrawing) {
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

socket.on('draw-incoming', (data) => {
    // // Draw based on the received drawing information
    // context.lineJoin = 'round';
    // context.lineCap = 'round';
    // context.lineWidth = 2;
    // context.beginPath();
    // context.moveTo(data.x1, data.y1);
    // context.lineTo(data.x2, data.y2);
    // context.stroke();
    console.log(data);
});