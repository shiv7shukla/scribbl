export class DrawingEngine {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    public isDrawing: boolean;
    public lastX: number;
    public lastY: number;
    public brushColor: string;
    public brushSize: number;
    public brushOpacity: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // Default brush settings
        this.brushColor = "#000000";
        this.brushSize = 3;
        this.brushOpacity = 1;

        this.setupEventListeners();
        this.configureContext();
    }

    configureContext() {
        if (!this.ctx) return;

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.imageSmoothingEnabled = true;
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

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        if (!this.ctx) return;

        const { x, y } = this.getCoordinates(e);

        // Configure stroke style
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.globalAlpha = this.brushOpacity;

        // Draw line segment
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        // Update last position
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        if (this.isDrawing && this.ctx) {
        this.isDrawing = false;
        this.ctx.closePath();
        }
    }

    setBrush(color: string, size: number, opacity = 1) {
        this.brushColor = color;
        this.brushSize = size;
        this.brushOpacity = opacity;
    }

    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}