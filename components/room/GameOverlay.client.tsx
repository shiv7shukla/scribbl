"use client";

import { useGameStore } from "@/app/providers/game-store-provider";
import { useEffect, useRef, useState } from "react";
import { Clock, Pencil } from "lucide-react";

const CHOICE_SECONDS = 15;

export default function GameOverlay() {
  const overlay = useGameStore((state) => state.overlay);
  const { submitWordChoice } = useGameStore((state) => state.actions);
  const [secondsLeft, setSecondsLeft] = useState(CHOICE_SECONDS);
  const hasSubmitted = useRef(false);

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
  }, [overlay]);

  useEffect(() => {
    if (overlay.type === "waiting" && secondsLeft === 0 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      submitWordChoice("");
  }
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
      </div>
    </div>
  );
}
