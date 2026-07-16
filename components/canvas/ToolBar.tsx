"use client";
import React, { useState } from 'react'
import { DrawingEngine } from '@/lib/drawingcanvas/DrawingEngine';
import { Trash2 } from 'lucide-react';

type ToolbarProps = {
    engineRef: React.RefObject<DrawingEngine | null>;
};

const ToolBar = ({ engineRef }: ToolbarProps) => {
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(3);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextColor = e.target.value;
        setColor(nextColor);
        engineRef.current?.setBrush(nextColor, size);
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextSize = Number.parseInt(e.target.value, 10);
        setSize(nextSize);
        engineRef.current?.setBrush(color, nextSize);
    };

    return (
        <div className='h-full w-full flex justify-around'>
            <input 
                type="color" 
                value={color}
                className='h-20 w-20 cursor-context-pointer'
                onChange={handleColorChange}
            />
            <input 
                type="range" 
                min="1" 
                max="100" 
                value={size}
                className='w-40 cursor-grab'
                onChange={handleSizeChange}
            />
            <button onClick={() => engineRef.current?.clear()} >
                <Trash2 className='cursor-pointer' size={30}/>
            </button>
        </div>
    )
}

export default ToolBar
