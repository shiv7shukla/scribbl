"use client";

import { DrawingEngine } from "@/lib/drawingcanvas/DrawingEngine";
import { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";
import { socket } from "@/app/socket";
import { useGameStore } from "@/app/providers/game-store-provider";
import { DrawEventPayload } from "@/lib/types/types";

export default function Canvas() {
    const engineRef = useRef<DrawingEngine>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currPlayer = useGameStore((state) => state.currPlayer);

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
        canvas.style.backgroundColor = "var(--canvas)";
        canvas.style.border = "1px solid var(--border)";
        canvas.style.borderRadius = "var(--radius-lg)";

        engineRef.current = new DrawingEngine(canvas, socket);

        socket.on("draw-event", (payload: DrawEventPayload) => {
            console.log(payload);
            switch (payload.type) {
                case "mousedown":
                    engineRef.current?.startDrawing(payload.x, payload.y);
                    break;
                case "mousemove":
                    engineRef.current?.draw(payload.x, payload.y);
                    break;
                case "mouseup":
                    engineRef.current?.stopDrawing();
                case "mouseout":
                    engineRef.current?.stopDrawing();
                    break;
                case "setbrush":
                    engineRef.current?.setBrush(payload.color, payload.size);
                    break;
                case "clear":
                    engineRef.current?.clear();
        }
    })

        return () => {
            engineRef.current?.destroy();
            engineRef.current = null;
            socket.off("draw-event");
        }
    }, []);

    useEffect(() => {
        engineRef.current?.invertInputEnabled(currPlayer.isDrawer);
    }, [currPlayer.isDrawer]);

    return (
        <div className="h-full w-full">
            <div
                className="h-[87%] w-full flex flex-col justify-between gap-2"
                ref={divRef}
            >
                <canvas id="drawingCanvas" ref={canvasRef} className="w-full" />
                {
                    currPlayer.isDrawer ?
                        <div className="flex h-auto w-full items-center justify-center">
                            <ToolBar engineRef={engineRef} />
                        </div> :
                        null
                }
            </div>
        </div>
    );
}
