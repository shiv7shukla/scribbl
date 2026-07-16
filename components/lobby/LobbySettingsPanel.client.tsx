import { LobbySettings, Player } from '@/lib/types/types';
import React, { useMemo } from 'react'
import LobbySettingsControl from './LobbySettingsControl.client';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const LobbySettingsPanel = ({
  roomCode,
  settings,
  isHost,
  players,
  onSettingsChange,
}: {
  roomCode: string;
  settings: LobbySettings;
  isHost: boolean;
  players: Player[];
  onSettingsChange: (patch: Partial<LobbySettings>) => void;
}) => {
  const customWordCount = useMemo(
    () =>
      settings.customWords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean).length,
    [settings.customWords],
  );

  async function copyRoomCode() {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success("Room code copied!");
    } catch {
      toast.error("Failed to copy room code");
    }
  }

  return (
    <section className="pop-card-lg flex h-full flex-col bg-paper p-6">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Room lobby
        </p>
        <h1 className="font-display text-3xl">{roomCode || "—"}</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-sm font-bold text-muted-foreground">
            {players.length}/{settings.maxPlayers} players ·{" "}
          </p>
          <button
            type="button"
            onClick={copyRoomCode}
            className="pop-btn pop-press inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold"
          >
            <Copy className="size-3.5" />
            Copy
          </button>
        </div>
      </div>

      <div className="grid flex-1 content-start gap-3 sm:grid-cols-2">
        <LobbySettingsControl
          label="Rounds"
          value={settings.rounds}
          options={[2, 3, 4, 5, 6, 8]}
          disabled={!isHost}
          onChange={(rounds) => onSettingsChange({ rounds })}
        />
        <LobbySettingsControl
          label="Draw time (s)"
          value={settings.drawTime}
          options={[40, 60, 80, 100, 120, 150]}
          disabled={!isHost}
          onChange={(drawTime) => onSettingsChange({ drawTime })}
        />
        <LobbySettingsControl
          label="Max players"
          value={settings.maxPlayers}
          options={[4, 6, 8, 10, 12]}
          disabled={!isHost}
          onChange={(maxPlayers) => onSettingsChange({ maxPlayers })}
        />
        <LobbySettingsControl
          label="Hints"
          value={settings.hints}
          options={[0, 1, 2, 3]}
          disabled={!isHost}
          onChange={(hints) => onSettingsChange({ hints })}
        />

        <div className="pop-card bg-card p-3 sm:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Custom words (comma separated)
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold">
              <input
                type="checkbox"
                checked={settings.useCustomWordsOnly}
                disabled={!isHost}
                onChange={(e) =>
                  onSettingsChange({ useCustomWordsOnly: e.target.checked })
                }
                className="size-4 accent-primary"
              />
              Use only custom
            </label>
          </div>
          <textarea
            value={settings.customWords}
            disabled={!isHost}
            onChange={(e) => onSettingsChange({ customWords: e.target.value })}
            rows={3}
            placeholder="cat, banana, lighthouse, etc."
            className="w-full resize-none rounded-md border-2 border-border bg-input px-3 py-2 text-sm font-bold disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {customWordCount} custom word{customWordCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-5 text-center">
        {isHost ? (
          <>
            <button
              type="button"
              disabled={players.length < 2}
              onClick={() => toast.success("Game would start here!")}
              className="pop-btn-primary pop-press px-8 py-4 font-display text-2xl disabled:opacity-50"
            >
              ▶ Start Game
            </button>
            {players.length < 2 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Need at least 2 players to start
              </p>
            )}
          </>
        ) : (
          <p className="font-display text-lg text-muted-foreground">
            Waiting for host to start...
          </p>
        )}
      </div>
    </section>
  );
}

export default LobbySettingsPanel
