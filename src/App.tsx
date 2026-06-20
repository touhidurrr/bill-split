import { useState } from "react";
import type { FeeMode, Person } from "./types";
import { computeSplit } from "./lib/split";
import { parseAmount } from "./lib/format";
import { renderReceipt } from "./lib/receipt";
import { BillInputs } from "./components/BillInputs";
import { PeopleCard } from "./components/PeopleCard";
import { SummaryCard } from "./components/SummaryCard";
import { ReceiptModal } from "./components/ReceiptModal";

const newPerson = (name = "", price = ""): Person => ({
  id: crypto.randomUUID(),
  name,
  price,
});

const DEFAULT_PEOPLE: Person[] = [
  newPerson("Touhid", "259.5"),
  newPerson("Muzadded", "259.5"),
  newPerson("Monika", "299"),
  newPerson("Ruba", "199"),
];

const FORMULAS: Record<FeeMode, string> = {
  equal: "price \u00d7 (Total \u2212 Fee) \u00f7 \u03a3price + Fee \u00f7 n",
  proportional: "price \u00d7 Total \u00f7 \u03a3price (fee by price)",
};

export default function App() {
  const [totalBillInput, setTotalBillInput] = useState("782.32");
  const [feeInput, setFeeInput] = useState("45");
  const [feeMode, setFeeMode] = useState<FeeMode>("equal");
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const totalBill = parseAmount(totalBillInput);
  const fee = parseAmount(feeInput);
  const split = computeSplit(people, totalBill, fee, feeMode);

  const addPerson = () => {
    const person = newPerson();
    setPeople((prev) => [...prev, person]);
    setLastAddedId(person.id);
  };

  const updatePerson = (
    id: string,
    patch: { name?: string; price?: string },
  ) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  };

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const generateReceipt = async () => {
    setReceiptUrl(await renderReceipt({ totalBill, fee, feeMode, split }));
  };

  return (
    <main className="mx-auto max-w-[580px] px-4 pt-7 pb-15">
      <header className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="bg-linear-115 from-teal from-10% via-sky via-55% to-violet bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent">
            Bill Split
          </h1>
          <p className="mt-1.5 font-mono text-xs text-faint">
            {FORMULAS[feeMode]}
          </p>
        </div>
        <p className="text-right font-mono text-xs text-mut">
          {new Date().toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </header>

      <BillInputs
        totalBill={totalBillInput}
        fee={feeInput}
        onTotalChange={setTotalBillInput}
        onFeeChange={setFeeInput}
      />

      <PeopleCard
        split={split}
        feeMode={feeMode}
        lastAddedId={lastAddedId}
        onFeeModeChange={setFeeMode}
        onPersonChange={updatePerson}
        onRemove={removePerson}
        onAdd={addPerson}
      />

      <SummaryCard
        split={split}
        totalBill={totalBill}
        fee={fee}
        onGenerateReceipt={() => void generateReceipt()}
      />

      {receiptUrl && (
        <ReceiptModal
          dataUrl={receiptUrl}
          onClose={() => setReceiptUrl(null)}
        />
      )}
    </main>
  );
}
