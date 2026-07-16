"use client";

import { ChatMessage, Player } from '@/lib/types/types';
import { Send } from 'lucide-react';
import React, { useState } from 'react'

const LobbyChatPanel = ({ players }: { players: Player[] }) => {
    const [messages, setMessages] = useState<ChatMessage[]>();

    function sendMessage() {
        const text = draft.trim();
        if (!text) return;

        // setMessages((prev) => [
        // ...prev,
        // {
        //     id: crypto.randomUUID(),
        //     author: "You",
        //     color: players[0]?.color ?? PLAYER_COLORS[0],
        //     text,
        // },
        // ]);
        setDraft("");
  }
    const [draft, setDraft] = useState("");
  return (
    <aside className="pop-card-lg flex h-full flex-col bg-paper p-4">
      <h2 className="mb-3 border-b-2 border-border/60 pb-3 font-display text-lg">Chat</h2>
      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {/* {messages.map((msg) => (
          <li key={msg.id} className="text-sm leading-snug">
            <span className="font-bold" style={{ color: msg.color }}>
              {msg.author}:
            </span>{" "}
            <span>{msg.text}</span>
          </li>
        ))} */}
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
          className="flex-1 rounded-xl border-[3px] border-border bg-input px-3 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="pop-btn-primary pop-press flex size-10 items-center justify-center rounded-xl disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </aside>
  )
}

export default LobbyChatPanel
