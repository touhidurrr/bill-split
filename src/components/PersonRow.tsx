import type { PersonShare } from "../types";
import { avatarGradient, initials } from "../lib/avatar";
import { exact, money } from "../lib/format";
import { useFlash } from "../lib/useFlash";

interface PersonRowProps {
  share: PersonShare;
  autoFocus: boolean;
  onChange: (
    patch: Partial<Pick<PersonShare["person"], "name" | "price">>,
  ) => void;
  onRemove: () => void;
  onSubmit: () => void;
}

export function PersonRow({
  share,
  autoFocus,
  onChange,
  onRemove,
  onSubmit,
}: PersonRowProps) {
  const { person } = share;
  const [copied, flashCopied] = useFlash();

  const copyShare = () => {
    void navigator.clipboard?.writeText(exact(share.total));
    flashCopied();
  };

  const submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="border-line hover:border-line-2 mb-3 rounded-2xl border bg-white/4 px-3.5 pt-3.5 transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-[40px_1fr_104px_34px] items-end gap-2.5 max-[430px]:grid-cols-[36px_1fr_88px_30px]">
        <div
          className="font-display grid size-10 place-items-center rounded-xl text-sm font-bold text-[#06121a] select-none max-[430px]:size-9 max-[430px]:rounded-[10px]"
          style={{ background: avatarGradient(person.name) }}
          aria-hidden
        >
          {initials(person.name)}
        </div>
        <div>
          <label className="field-label">Name</label>
          <input
            className="field-input"
            placeholder="Name"
            value={person.name}
            autoFocus={autoFocus}
            onChange={(e) => onChange({ name: e.target.value })}
            onKeyDown={submitOnEnter}
          />
        </div>
        <div>
          <label className="field-label">Item Price</label>
          <input
            className="field-input font-mono font-medium"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0"
            value={person.price}
            onChange={(e) => onChange({ price: e.target.value })}
            onKeyDown={submitOnEnter}
          />
        </div>
        <button
          type="button"
          className="text-faint hover:border-rose/40 hover:bg-rose/8 hover:text-rose h-[42px] rounded-[10px] border border-transparent text-[17px] transition-colors"
          aria-label={`Remove ${person.name || "person"}`}
          onClick={onRemove}
        >
          &#10005;
        </button>
      </div>

      {/* receipt stub */}
      <button
        type="button"
        title="Tap to copy amount"
        onClick={copyShare}
        className="border-line-2 hover:bg-sky/7 -mx-3.5 mt-3 flex w-[calc(100%+1.75rem)] items-center justify-between gap-2.5 rounded-b-2xl border-t-[1.5px] border-dashed bg-black/22 px-4 py-2.5 text-left transition-colors"
      >
        <span className="text-mut font-mono text-[11px] font-medium">
          item price{" "}
          <b className="text-teal font-bold">{money(share.itemShare)}</b>{" "}
          &middot; fee{" "}
          <b className="text-sky font-bold">{money(share.feeShare)}</b>
        </span>
        <span className="border-violet/25 bg-violet/10 text-violet rounded-full border px-2 py-0.5 font-mono text-[11px] font-bold whitespace-nowrap">
          {share.percent.toFixed(1)}%
        </span>
        <b className="text-teal max-w-[46%] text-right font-mono text-base font-bold wrap-anywhere max-[430px]:text-sm">
          {copied ? "copied!" : exact(share.total)}
        </b>
      </button>
    </div>
  );
}
