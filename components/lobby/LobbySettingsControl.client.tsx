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
    <div className="surface-card p-3">
      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`rounded-md border px-3 py-1 text-sm font-medium transition-colors ${
              value === option
                ? "surface-btn-selected"
                : "border-border/50 bg-card text-foreground hover:border-primary/30 hover:bg-accent"
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
