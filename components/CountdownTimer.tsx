"use cient";

import { useGameStore } from '@/app/providers/game-store-provider';
import React from 'react'
import { useState, useEffect } from 'react';

const CountdownTimer = () => {
    const drawTime = useGameStore((state) => state.drawTime);
    const [ minutes, setMinutes ] = useState(Math.floor(drawTime / 60));
    const [seconds, setSeconds ] =  useState(drawTime % 60);
    const { setTime } = useGameStore((state) => state.actions);

    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
                setTime("seconds", seconds-1);
            }
            if (seconds === 0) {
                if (minutes === 0)
                    clearInterval(myInterval)
                else {
                    setMinutes(minutes - 1);
                    setTime("minutes", minutes-1);
                    setSeconds(59);
                    setTime("seconds", 59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    return (
        <div>
        { minutes === 0 && seconds === 0
            ? null
            : <h1> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1> 
        }
        </div>
    )
}

export default CountdownTimer;
