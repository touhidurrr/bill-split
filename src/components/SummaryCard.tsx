import type { SplitResult } from "../types";
import { compact, exact, money } from "../lib/format";
import { useFlash } from "../lib/useFlash";

interface SummaryCardProps {
  split: SplitResult;
  totalBill: number;
  fee: number;
  onGenerateReceipt: () => void;
}

export function SummaryCard({
  split,
  totalBill,
  fee,
  onGenerateReceipt,
}: SummaryCardProps) {
  const [copied, flashCopied] = useFlash();

  const copyAsText = () => {
    const lines = [
      `Bill Split \u2014 Total ${money(totalBill)} (fee ${money(fee)})`,
      ...split.shares.map(
        (s) => `\u2022 ${s.person.name || "(unnamed)"}: ${exact(s.total)}`,
      ),
    ];
    void navigator.clipboard?.writeText(lines.join("\n"));
    flashCopied();
  };

  return (
    <section className="glass-card flex flex-col gap-2.5">
      <Row label="Σ Item Price" value={compact(split.sumItemPrice)} />
      <Row label="Food Price (Total − Fee)" value={money(split.foodPrice)} />

      <div className="grid grid-cols-2 gap-2.5 border-y border-line py-3">
        <Chip
          label="Item Share Σ"
          value={money(split.sumItemShare)}
          tone="text-teal"
        />
        <Chip
          label="Fee Share Σ"
          value={money(split.sumFeeShare)}
          tone="text-sky"
        />
      </div>

      <div className="flex items-center justify-between font-display text-[19px] font-bold">
        <span>Total</span>
        <span className="bg-linear-115 from-teal to-sky bg-clip-text font-mono text-transparent">
          {money(totalBill)}
        </span>
      </div>

      {split.shares.length > 0 && (
        <p
          className={`text-xs ${split.matchesBill ? "text-teal" : "text-rose"}`}
        >
          {split.matchesBill
            ? "\u2713 Splits match total"
            : `\u26a0 Off by ${money(Math.abs(split.sumTotal - totalBill))}`}
        </p>
      )}

      <div className="mt-1 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={copyAsText}
          className="rounded-[14px] border border-teal/28 bg-teal/6 p-3 text-[13.5px] font-bold text-teal transition-colors hover:bg-teal/14"
        >
          {copied ? "Copied!" : "Copy as text"}
        </button>
        <button
          type="button"
          onClick={onGenerateReceipt}
          className="rounded-[14px] bg-linear-115 from-teal to-sky p-3 text-[13.5px] font-bold text-[#04222b] shadow-[0_6px_22px_rgba(56,189,248,0.35)] transition-[filter,box-shadow] hover:brightness-108 hover:shadow-[0_8px_26px_rgba(56,189,248,0.45)]"
        >
          &#11015; Receipt PNG
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13.5px]">
      <span className="text-mut">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  );
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-black/25 px-3 py-2.5">
      <p className="mb-1 font-display text-[10px] font-semibold tracking-[0.1em] text-mut uppercase">
        {label}
      </p>
      <p className={`font-mono text-base font-bold ${tone}`}>{value}</p>
    </div>
  );
}
