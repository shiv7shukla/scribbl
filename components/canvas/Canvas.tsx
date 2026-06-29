"use client";

import { DrawingEngine } from "@/lib/drawingcanvas/DrawingEngine";
import { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<DrawingEngine>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!(canvas instanceof HTMLCanvasElement)) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);

        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        engineRef.current = new DrawingEngine(canvas);
    }, []);

    return(
        <div className="canvas-container">
            <ToolBar engineRef={engineRef} />
            <canvas id="drawingCanvas" ref={canvasRef}></canvas>
        </div>
    )
}