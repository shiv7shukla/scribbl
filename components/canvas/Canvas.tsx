"use client";

import { useEffect } from "react";

export default function Canvas(){


    useEffect(() => {
        const canvas = document.getElementById("drawingCanvas");
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
    }, []);

    return(
        <div className="canvas-container">
            <canvas id="drawingCanvas"></canvas>
        </div>
    )
}