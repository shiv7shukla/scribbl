"use client";

import { useGameStore } from "@/app/providers/game-store-provider";
import { memo, useEffect, useRef, useState } from "react";
import { Clock, Pencil } from "lucide-react";
import { useShallow } from "zustand/shallow";
import Confetti from "../Confetti";

const CHOICE_SECONDS = 15;

const GameOverlay = memo(function GameOverlay() {
  const { submitWordChoice, clearOverlay } = useGameStore((state) => state.actions);
  const [secondsLeft, setSecondsLeft] = useState(CHOICE_SECONDS);
  const hasSubmitted = useRef(false);
  const {
     overlay,
     players 
    } = useGameStore(useShallow((state) => ({
    overlay: state.overlay,
    players: state.players
})));

  useEffect(() => {
    if (overlay.type !== "waiting") return;

    hasSubmitted.current = false;
    setSecondsLeft(CHOICE_SECONDS);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [overlay.type]);

  useEffect(() => {
    if (overlay.type === "waiting" && secondsLeft === 0 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      submitWordChoice(overlay.words[0]);
    }
    else if (overlay.type === "score-board" && secondsLeft === 0)
      clearOverlay();
  }, [secondsLeft, overlay.type, submitWordChoice]);

  if (overlay.type === null) return null;

  const handleChoose = (word: string) => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    submitWordChoice(word);
  };
  const progress = overlay.type === "waiting" ? (secondsLeft / CHOICE_SECONDS) * 100 : 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="surface-card mx-4 w-full max-w-md p-8 text-center">
        {overlay.type === "is-choosing" && (
          <>
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
              <Pencil className="size-6 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">Word selection</p>
            <p className="mt-2 font-display text-2xl">
              <span className="text-primary">{overlay.username}</span>
              {"  "}is choosing the word
            </p>
          </>
        )}

        {overlay.type === "waiting" && (
          <>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Choose a word to draw
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="font-mono text-2xl tabular-nums">{secondsLeft}s</span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {overlay.words.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleChoose(word)}
                  className="surface-btn w-full py-3.5 font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {word}
                </button>
              ))}
            </div>
          </>
        )}

        {overlay.type === "score-board" && (
          <>
            <div className="mt-8 flex flex-col gap-3">
              {players.map((p) => (
                <div
                  key={p.socketID}
                  className="surface-btn w-full py-3.5 font-medium transition-colors"
                >
                  {p.username}
                  {" "}
                  {p.score}
                </div>
              ))}
            </div>
          </>
        )}

        {overlay.type === "game-over" && (
          <>
            <Confetti />
            <p className="mt-2 font-display text-2xl">
              <span className="text-primary">{players[0].username} {" "} is the Winner !!!</span>
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {players.map((p) => (
                <div
                  key={p.socketID}
                  className="surface-btn w-full py-3.5 font-medium transition-colors"
                >
                  {p.username}
                  {" "}
                  {p.score}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default GameOverlay;