import LobbyContent from "@/components/lobby/LobbyContent.client";
import { Suspense } from "react";

function LobbyFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
    <p className="font-display text-2xl text-muted-foreground">Loading lobby...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LobbyFallback />}>
      <LobbyContent />
    </Suspense>
  );
}
