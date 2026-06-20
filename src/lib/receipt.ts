import type { FeeMode, SplitResult } from "../types";
import { exact, money } from "./format";

const MONO = '"Fira Code Variable", monospace';
const WIDTH = 720;
const PAD = 56;
const TOOTH_W = 16;
const TOOTH_H = 12;
const ROW_H = 86;
const SCALE = 2;

const INK = "#1c2128";
const SOFT = "#6b7280";
const TEAL = "#0d9488";
const SKY = "#0369a1";

interface ReceiptInput {
  totalBill: number;
  fee: number;
  feeMode: FeeMode;
  split: SplitResult;
}

/** Renders a thermal-receipt-style PNG and returns it as a data URL. */
export async function renderReceipt(input: ReceiptInput): Promise<string> {
  await loadFonts();

  const { totalBill, fee, feeMode, split } = input;
  const height = 308 + split.shares.length * ROW_H + 286;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.scale(SCALE, SCALE);

  drawPaper(ctx, height);

  const dash = (y: number) => {
    ctx.save();
    ctx.strokeStyle = "#c9c4b4";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(WIDTH - PAD, y);
    ctx.stroke();
    ctx.restore();
  };

  let y = 78;

  // header
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `700 34px ${MONO}`;
  ctx.fillText("\u2605 BILL SPLIT \u2605", WIDTH / 2, y);
  y += 30;
  ctx.font = `500 17px ${MONO}`;
  ctx.fillStyle = SOFT;
  ctx.fillText(formatTimestamp(), WIDTH / 2, y);
  y += 18;
  ctx.fillText(
    feeMode === "equal" ? "fee split equally" : "fee split by price",
    WIDTH / 2,
    y,
  );
  y += 26;
  dash(y);
  y += 44;

  // totals
  const line = (label: string, value: string, big = false, color = INK) => {
    ctx.font = big ? `700 30px ${MONO}` : `500 19px ${MONO}`;
    ctx.fillStyle = big ? color : SOFT;
    ctx.textAlign = "left";
    ctx.fillText(label, PAD, y);
    ctx.fillStyle = big ? color : INK;
    ctx.textAlign = "right";
    ctx.fillText(value, WIDTH - PAD, y);
    y += big ? 44 : 30;
  };
  line("TOTAL BILL", money(totalBill), true);
  line("food price", money(split.foodPrice));
  line("delivery + fee", money(fee));
  y += 4;
  dash(y);
  y += 48;

  // people — full precision, poi poi hisab
  for (const share of split.shares) {
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    ctx.font = `700 21px ${MONO}`;
    ctx.fillText((share.person.name || "(unnamed)").slice(0, 24), PAD, y);
    ctx.textAlign = "right";
    ctx.fillStyle = TEAL;
    ctx.fillText(exact(share.total), WIDTH - PAD, y);
    y += 26;
    ctx.textAlign = "left";
    ctx.fillStyle = SOFT;
    ctx.font = `500 15px ${MONO}`;
    ctx.fillText(
      `item price ${money(Number.parseFloat(share.person.price) || 0)} \u00b7 ${share.percent.toFixed(1)}% \u00b7 fee ${money(share.feeShare)}`,
      PAD,
      y,
    );
    y += ROW_H - 26;
  }
  y += 2;
  dash(y);
  y += 44;

  // grand total + motto
  ctx.font = `700 24px ${MONO}`;
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.fillText("GRAND TOTAL", PAD, y);
  ctx.textAlign = "right";
  ctx.fillStyle = SKY;
  ctx.fillText(money(totalBill), WIDTH - PAD, y);
  y += 34;
  ctx.textAlign = "center";
  ctx.font = `500 16px ${MONO}`;
  ctx.fillStyle = SOFT;
  ctx.fillText(
    "\u2713 poi poi hisab \u2014 exact to the last poisha",
    WIDTH / 2,
    y,
  );
  y += 40;

  drawBarcode(ctx, y, totalBill);
  y += 72;
  ctx.font = `500 14px ${MONO}`;
  ctx.fillStyle = "#a8a294";
  ctx.fillText("thank you \u00b7 come hungry again", WIDTH / 2, y);

  return canvas.toDataURL("image/png");
}

async function loadFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load(`700 30px ${MONO}`),
      document.fonts.load(`500 22px ${MONO}`),
    ]);
  } catch {
    // fall back to system monospace
  }
}

/** Paper background with zigzag torn edges, top and bottom. */
function drawPaper(ctx: CanvasRenderingContext2D, height: number): void {
  ctx.beginPath();
  ctx.moveTo(0, TOOTH_H);
  for (let x = 0; x < WIDTH; x += TOOTH_W) {
    ctx.lineTo(x + TOOTH_W / 2, 0);
    ctx.lineTo(x + TOOTH_W, TOOTH_H);
  }
  ctx.lineTo(WIDTH, height - TOOTH_H);
  for (let x = WIDTH; x > 0; x -= TOOTH_W) {
    ctx.lineTo(x - TOOTH_W / 2, height);
    ctx.lineTo(x - TOOTH_W, height - TOOTH_H);
  }
  ctx.closePath();
  const paper = ctx.createLinearGradient(0, 0, 0, height);
  paper.addColorStop(0, "#fdfbf5");
  paper.addColorStop(1, "#f5f1e6");
  ctx.fillStyle = paper;
  ctx.fill();
}

/** Decorative barcode, seeded from the bill total so each bill gets its own. */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  y: number,
  totalBill: number,
): void {
  let x = PAD + 40;
  let seed = Math.round(totalBill * 100) || 7;
  ctx.fillStyle = INK;
  while (x < WIDTH - PAD - 40) {
    seed = (seed * 48271) % 2147483647;
    const barWidth = 2 + (seed % 5);
    if (seed % 3) ctx.fillRect(x, y, barWidth, 54);
    x += barWidth + 3;
  }
}

function formatTimestamp(): string {
  return new Date().toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
