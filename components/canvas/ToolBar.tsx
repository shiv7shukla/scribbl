import React from 'react'
import { DrawingEngine } from '@/lib/drawingcanvas/DrawingEngine';

type ToolbarProps = {
    engineRef: React.RefObject<DrawingEngine | null>;
};

const ToolBar = ({ engineRef }: ToolbarProps) => {
    return (
        <div>
            <input 
                type="color" 
                defaultValue="#000000" 
                onChange={(e) => {
                    if (engineRef.current) 
                        engineRef.current.setBrush(e.target.value, engineRef.current.brushSize)
                    }
                } 
            />
            <input 
                type="range" 
                min="1" 
                max="50" 
                defaultValue="3"
                onChange={(e) => {
                    if (engineRef.current) 
                        engineRef.current.setBrush(engineRef.current.brushColor, parseInt(e.target.value))
                    }
                }
            />
            <button onClick={() => engineRef.current?.clear()}>Clear Canvas</button>
        </div>
    )
}

export default ToolBar
