"use client";

import { DrawingEngine } from "@/lib/drawingcanvas/DrawingEngine";
import { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";
import { useSocket } from "@/lib/context/SocketContext";

export default function Canvas() {
    const engineRef = useRef<DrawingEngine>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {socket, isConnected} = useSocket();

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
        canvas.style.border = `1px solid #000`;

        engineRef.current = new DrawingEngine(canvas, socket);

        socket.on("draw-event", (payload) => {
        switch (payload.type){
            case "mousedown":
                engineRef.current?.startDrawing(payload.x, payload.y);
                break;
            case "mousemove":
                engineRef.current?.draw(payload.x, payload.y);
                break;
            case "mouseup":
                engineRef.current?.stopDrawing();
                break;
            case "mouseout":
                engineRef.current?.stopDrawing();
                break;
        }
    })

        return () => {
            engineRef.current?.destroy();
            engineRef.current = null;
            socket.off("draw-event");
        }
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
