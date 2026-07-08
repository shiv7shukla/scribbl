import LobbyContent from "@/components/lobby/LobbyContent.client";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}> 
            <LobbyContent />
        </Suspense>
    );
}
