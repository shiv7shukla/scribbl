"use client";

import { socket } from "@/app/socket";
import InputBox from "@/components/landing/InputBox.client";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);

  

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          scribbl
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw. Guess. Repeat.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Socket: {isConnected ? `${transport} connected` : "connecting"}
        </p>
      </header>
      <InputBox />
    </div>
  );
}
