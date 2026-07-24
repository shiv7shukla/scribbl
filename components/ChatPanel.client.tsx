"use client";

import { useGameStore } from '@/app/providers/game-store-provider';
import { ChatMessage, Player } from '@/lib/types/types';
import { Send } from 'lucide-react';
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';

const ChatPanel = ({ players }: { players: Player[] }) => {
    const [draft, setDraft] = useState("");
    const { 
      messages, 
      currPlayer,
      minutes,
      seconds
    } = useGameStore(useShallow((state) => ({
      messages: state.messages,
      currPlayer: state.currPlayer,
      minutes: state.minutes,
      seconds: state.seconds
    })));
    const { newMessage, sendNewMessage } = useGameStore((state) => state.actions);

    function sendMessage() {
      const text = draft.trim();
      if (!text) return;
      const id = crypto.randomUUID();
      newMessage({id, sender: currPlayer.username, message: text});
      sendNewMessage({id, sender: currPlayer.username, message: text, minutes, seconds});
      setDraft("");
  }
  return (
    <aside className="surface-card-lg flex h-full flex-col p-4">
      <h2 className="mb-3 border-b border-border/60 pb-3 font-medium">Chat</h2>
      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <li key={msg.id} className="text-sm leading-snug">
            <span className="font-bold">
              {msg.sender}:
            </span>{" "}
            <span>{msg.message}</span>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
          className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="surface-btn-primary flex size-10 items-center justify-center disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </aside>
  )
}

export default ChatPanel
