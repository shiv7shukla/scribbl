"use cient";

import { useGameStore } from '@/app/providers/game-store-provider';
import { useState, useEffect } from 'react';

const CountdownTimer = () => {
    const { setTime, newTurn, scoreBoard } = useGameStore((state) => state.actions);
    const drawTime = useGameStore((state) => state.drawTime);
    const [ minutes, setMinutes ] = useState(Math.floor(drawTime / 60));
    const [seconds, setSeconds ] =  useState(drawTime % 60);

    useEffect(() => {
        let myInterval = setInterval(() => {
            setSeconds(prev => {
                if (prev > 0) return prev - 1;
                else {
                    setMinutes(minute => {
                        if (minute > 0) return minute - 1;
                        else {
                            clearInterval(myInterval);
                            return 0;
                        }
                    })
                    return 59;
                }
            })
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });

    useEffect(() => {
        setTime("seconds", seconds);
        setTime("minutes", minutes);
        if (seconds === 0 && minutes === 0) 
            scoreBoard();
    }, [seconds, minutes]);

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
