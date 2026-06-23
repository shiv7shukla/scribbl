// import { useState } from "react";
// import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  // const [name, setName] = useState("");
  // const [joinCode, setJoinCode] = useState("");
  // const [creating, setCreating] = useState(false)

  // function ensureName(): string | null {
  //   const trimmed = name.trim().slice(0, 20);
  //   if (!trimmed) {
  //     toast.error("Pick a nickname first!");
  //     return null;
  //   }
  //   return trimmed;
  // }


  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          skribbly
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Draw. Guess. Repeat.
        </p>
      </header>

      <main className="max-w-md mx-auto px-4 pb-16">
        {/* Left: profile + create/join */}
        <section className="pop-card-lg p-6 space-y-6">
          <div>
            <label className="block font-display text-lg mb-2">
              Your nickname
            </label>
            <input
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              placeholder="Captain Doodle"
              maxLength={20}
              className="w-full px-4 py-3 text-lg font-bold border-[3px] border-border rounded-xl bg-input focus:outline-none focus:ring-4 focus:ring-primary/30"
            />
          </div>

          <div className="pt-2">
            <label className="block font-display text-lg mb-2">
              Have a room code?
            </label>
            <div className="flex gap-2">
              <input
                // value={joinCode}
                // onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={8}
                className="flex-1 px-4 py-3 text-lg font-bold tracking-widest uppercase border-[3px] border-border rounded-xl bg-input focus:outline-none focus:ring-4 focus:ring-primary/30"
              />
              <button
                // onClick={() => joinRoom(joinCode)}
                className="pop-card pop-press px-6 font-display text-lg bg-primary text-primary-foreground"
              >
                Join
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
