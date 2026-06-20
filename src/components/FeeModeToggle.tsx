import type { FeeMode } from "../types";

const MODES: { value: FeeMode; label: string }[] = [
  { value: "equal", label: "Fee: equal" },
  { value: "proportional", label: "Fee: by price" },
];

interface FeeModeToggleProps {
  mode: FeeMode;
  onChange: (mode: FeeMode) => void;
}

export function FeeModeToggle({ mode, onChange }: FeeModeToggleProps) {
  return (
    <div
      className="flex overflow-hidden rounded-[10px] border border-line bg-black/25"
      role="radiogroup"
      aria-label="How the fee is split"
    >
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          onClick={() => onChange(value)}
          className={`px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
            mode === value ? "bg-sky/16 text-sky" : "text-mut hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
