"use client";

import { DrawingEngine } from "@/lib/drawingcanvas/DrawingEngine";
import { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";

export default function Canvas() {
    const engineRef = useRef<DrawingEngine>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!(canvas instanceof HTMLCanvasElement)) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = divRef.current?.getBoundingClientRect().width;
        const height = divRef.current?.getBoundingClientRect().height;

        if (width && height) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.backgroundColor = "snow";

        engineRef.current = new DrawingEngine(canvas);
    }, []);

    return (
        <div className="h-full w-full">
            <div
                className="h-[87%] w-full flex flex-col justify-between gap-2"
                ref={divRef}
            >
                <canvas id="drawingCanvas" ref={canvasRef} className="w-full" />
                <div className="flex h-auto w-full items-center justify-center">
                    <ToolBar engineRef={engineRef} />
                </div>
            </div>
        </div>
    );
}
