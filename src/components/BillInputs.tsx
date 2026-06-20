interface BillInputsProps {
  totalBill: string;
  fee: string;
  onTotalChange: (value: string) => void;
  onFeeChange: (value: string) => void;
}

export function BillInputs({
  totalBill,
  fee,
  onTotalChange,
  onFeeChange,
}: BillInputsProps) {
  return (
    <section className="glass-card grid grid-cols-1 gap-3 min-[430px]:grid-cols-2">
      <div>
        <label className="field-label" htmlFor="total-bill">
          Total Bill
        </label>
        <input
          id="total-bill"
          className="field-input font-mono font-medium"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={totalBill}
          onChange={(e) => onTotalChange(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label" htmlFor="delivery-fee">
          Delivery + Service Fee
        </label>
        <input
          id="delivery-fee"
          className="field-input font-mono font-medium"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={fee}
          onChange={(e) => onFeeChange(e.target.value)}
        />
      </div>
    </section>
  );
}
