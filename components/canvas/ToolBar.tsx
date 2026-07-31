"use client";

import React, { useState } from 'react'
import { DrawingEngine } from '@/lib/drawingcanvas/DrawingEngine';
import { Trash2 } from 'lucide-react';
import { useGameStore } from '@/app/providers/game-store-provider';
import { socket } from '@/app/socket';
import { DrawEventPayload } from '@/lib/types/types';

type ToolbarProps = {
    engineRef: React.RefObject<DrawingEngine | null>;
};

const ToolBar = ({ engineRef }: ToolbarProps) => {
    const currPlayer = useGameStore((state) => state.currPlayer);
    const { sendBrushEvent } = useGameStore((state) => state.actions);

    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(3);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextColor = e.target.value;
        setColor(nextColor);
        engineRef.current?.setBrush(nextColor, size);
        sendBrushEvent({type: "setbrush", color: nextColor, size});
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextSize = Number.parseInt(e.target.value, 10);
        setSize(nextSize);
        engineRef.current?.setBrush(color, nextSize);
        sendBrushEvent({type: "setbrush", color, size: nextSize});
    };

    return (
        <div className="flex h-full w-full items-center justify-center gap-6 rounded-lg border border-border/50 bg-muted/20 px-4 py-2">
            <input 
                type="color" 
                value={color}
                className="size-10 cursor-pointer rounded-md border border-border bg-transparent"
                onChange={handleColorChange}
            />
            <input 
                type="range" 
                min="1" 
                max="100" 
                value={size}
                className="w-32 cursor-pointer accent-primary"
                onChange={handleSizeChange}
            />
            <button
                type="button"
                onClick={() => {engineRef.current?.clear(); socket.emit("draw-event", {type: "clear"})}}
                className="surface-btn flex size-10 items-center justify-center"
                aria-label="Clear canvas"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
    )
}

export default ToolBar
