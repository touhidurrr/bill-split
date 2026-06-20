import type { FeeMode, SplitResult } from "../types";
import { FeeModeToggle } from "./FeeModeToggle";
import { PersonRow } from "./PersonRow";

interface PeopleCardProps {
  split: SplitResult;
  feeMode: FeeMode;
  lastAddedId: string | null;
  onFeeModeChange: (mode: FeeMode) => void;
  onPersonChange: (
    id: string,
    patch: { name?: string; price?: string },
  ) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function PeopleCard({
  split,
  feeMode,
  lastAddedId,
  onFeeModeChange,
  onPersonChange,
  onRemove,
  onAdd,
}: PeopleCardProps) {
  const count = split.shares.length;

  return (
    <section className="glass-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="field-label mb-0!">People</h2>
        <FeeModeToggle mode={feeMode} onChange={onFeeModeChange} />
        <span className="rounded-full border border-teal/22 bg-teal/8 px-2.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap text-teal">
          {count} {count === 1 ? "person" : "persons"}
        </span>
      </div>

      {count === 0 && (
        <p className="mb-3 rounded-[14px] border-[1.5px] border-dashed border-line p-5 text-center text-[13px] text-faint">
          No one yet &mdash; add a person to start splitting.
        </p>
      )}

      {split.shares.map((share) => (
        <PersonRow
          key={share.person.id}
          share={share}
          autoFocus={share.person.id === lastAddedId}
          onChange={(patch) => onPersonChange(share.person.id, patch)}
          onRemove={() => onRemove(share.person.id)}
          onSubmit={onAdd}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full rounded-[14px] border-[1.5px] border-dashed border-line-2 bg-sky/5 p-3 text-[13.5px] font-bold tracking-wide text-sky transition-colors hover:border-sky hover:bg-sky/12"
      >
        + Add person
      </button>
    </section>
  );
}
