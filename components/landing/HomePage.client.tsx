import InputBox from "@/components/landing/InputBox.client";
import { Toaster } from "@/components/ui/sonner";

export default function HomePage() {
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
      </header>
      <InputBox />
    </div>
  );
}
