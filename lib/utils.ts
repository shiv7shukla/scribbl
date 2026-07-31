import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DrawEventPayload } from "./types/types"
import type React from "react";
import type { DrawingEngine } from "./drawingcanvas/DrawingEngine";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function canvasStrokes (payload: DrawEventPayload, engineRef: React.RefObject<DrawingEngine | null>) {
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
}