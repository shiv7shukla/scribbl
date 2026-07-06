import React from 'react'
import { DrawingEngine } from '@/lib/drawingcanvas/DrawingEngine';
import { Trash2 } from 'lucide-react';

type ToolbarProps = {
    engineRef: React.RefObject<DrawingEngine | null>;
};

const ToolBar = ({ engineRef }: ToolbarProps) => {
    return (
        <div className='h-full w-full flex justify-around'>
            <input 
                type="color" 
                defaultValue="#000000" 
                className='h-20 w-20 cursor-context-pointer'
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
                className='w-60 cursor-grab'
                onChange={(e) => {
                    if (engineRef.current) 
                        engineRef.current.setBrush(engineRef.current.brushColor, parseInt(e.target.value))
                    }
                }
            />
            <button onClick={() => engineRef.current?.clear()} >
                <Trash2 className='cursor-pointer' size={30}/>
            </button>
        </div>
    )
}

export default ToolBar
