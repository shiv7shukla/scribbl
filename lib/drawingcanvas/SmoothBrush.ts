export class SmoothBrush{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    smoothing: number;
    points: { x: number; y: number }[];

    constructor(canvas: HTMLCanvasElement, smoothing = 0.3) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.smoothing = smoothing;
        this.points = [];
    }

    addPoint(x:number, y:number) {
        this.points.push({x, y});
        
        // Keep only recent points for smoothing
        if (this.points.length > 5) this.points.shift();
        
        if (this.points.length >= 3) this.drawSmoothedLine();
        
        // else if (this.points.length === 2 && this.ctx) {
        //    this.ctx.beginPath();
        //    this.ctx.moveTo(this.points[0].x, this.points[0].y);
        //    this.ctx.lineTo(this.points[1].x, this.points[1].y);
        //    this.ctx.stroke();
        // }
    }

    drawSmoothedLine() {
        if (!this.ctx) return;

        const p1 = this.points[this.points.length - 3];
        const p2 = this.points[this.points.length - 2];
        const p3 = this.points[this.points.length - 1];
        
        // Calculate control points for quadratic curve
        const cp1x = p1.x + (p2.x - p1.x) * this.smoothing;
        const cp1y = p1.y + (p2.y - p1.y) * this.smoothing;
        const cp2x = p2.x + (p3.x - p2.x) * this.smoothing;
        const cp2y = p2.y + (p3.y - p2.y) * this.smoothing;
        
        this.ctx.beginPath();
        this.ctx.moveTo(cp1x, cp1y);
        this.ctx.quadraticCurveTo(p2.x, p2.y, cp2x, cp2y);
        this.ctx.stroke();
    }
    
    reset() {
        this.points = [];
    }
}