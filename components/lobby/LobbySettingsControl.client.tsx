"use client";

import React from 'react'

const LobbySettingsControl = ({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  disabled: boolean;
  onChange: (v: number) => void;
}) => {
  return (
    <div className="pop-card bg-card p-3">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`rounded-md border-2 px-3 py-1 text-sm font-bold transition-colors ${
              value === option
                ? "pop-btn-selected border-foreground"
                : "border-border/50 bg-card text-foreground hover:border-foreground/40"
            } disabled:opacity-50`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LobbySettingsControl
