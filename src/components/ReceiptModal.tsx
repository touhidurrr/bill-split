interface ReceiptModalProps {
  dataUrl: string;
  onClose: () => void;
}

export function ReceiptModal({ dataUrl, onClose }: ReceiptModalProps) {
  return (
    <div
      className="fixed inset-0 z-10 grid place-items-center bg-[rgba(3,5,10,0.72)] p-5 backdrop-blur-md"
      role="dialog"
      aria-modal
      aria-label="Receipt preview"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-md overflow-auto text-center">
        <img
          src={dataUrl}
          alt="Bill split receipt"
          className="w-full rounded-md drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
        />
        <div className="mt-3.5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[14px] border border-teal/28 bg-teal/6 p-3 text-[13.5px] font-bold text-teal transition-colors hover:bg-teal/14"
          >
            Close
          </button>
          <a
            href={dataUrl}
            download="bill-split-receipt.png"
            className="grid flex-1 place-items-center rounded-[14px] bg-linear-115 from-teal to-sky p-3 text-[13.5px] font-bold text-[#04222b] no-underline shadow-[0_6px_22px_rgba(56,189,248,0.35)] transition-[filter] hover:brightness-108"
          >
            Download PNG
          </a>
        </div>
        <p className="mt-2.5 text-xs text-mut">
          On mobile: long-press the image to save or share.
        </p>
      </div>
    </div>
  );
}
