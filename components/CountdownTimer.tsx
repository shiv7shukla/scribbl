"use client";

import { useGameStore } from '@/app/providers/game-store-provider';
import { useState, useEffect, memo } from 'react';
import { useShallow } from 'zustand/shallow';

const CountdownTimer = memo(function CountdownTimer() {
    const { setTime, scoreBoard } = useGameStore((state) => state.actions);
    const { turnEndsAt, clockOffSet } = useGameStore(useShallow((state) => ({ turnEndsAt: state.turnEndsAt, clockOffSet: state.clockOffSet})));
    const [remaining, setRemaining] = useState(() => Math.max(0, turnEndsAt - Date.now()));

  useEffect(() => {
    const initial = Math.max(0, turnEndsAt - (Date.now() + clockOffSet));
    setRemaining(initial);

    const interval = setInterval(() => {
      const rem = Math.max(0, turnEndsAt - (Date.now() + clockOffSet));
      setRemaining(rem);
      setTime("minutes", minutes);
      setTime("seconds", seconds);
      if (rem <= 0) {
        clearInterval(interval);
        scoreBoard();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [turnEndsAt]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;


    return (
        <div>
        { minutes === 0 && seconds === 0
            ? null
            : <h1> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</h1> 
        }
        </div>
    )
})

export default CountdownTimer;
