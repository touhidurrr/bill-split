# Bill Split

Split the bill with your friends, get poi poi hisab and a receipt. Welcome to bill split!

<p align="center">
  <img width="360" height="469" alt="bill-split.touhidur.bd"
    src="https://github.com/user-attachments/assets/8911c95c-020d-4bab-9faa-f60cfbe6760f" />
</p>

A single-screen React app. No backend, no accounts, no storage, no third-party requests. Type the total, the delivery fee, and what each person ordered; it computes everyone's exact share live and renders a downloadable receipt.

## Features

- **Live breakdown** — per-person item share, fee share, total, and % of the bill, recomputed as you type
- **Two fee modes** — split the delivery fee equally per head, or proportionally to each person's order
- **Add / remove people** on the fly, with a freshly added row flashed into view
- **Sanity check** — confirms `Σ shares == Total` within a 0.01 tolerance, so the bill always balances
- **Thermal receipt** — canvas-rendered PNG with torn paper edges, a total-seeded barcode, and per-person lines; download and share
- **Name-hashed avatars** — initials on a gradient derived from the name
- **No rounding** — shares carry full float precision; money is formatted only at the surface

## How the split works

Food cost (`Total − Fee`) splits by each person's item price. The fee splits two ways:

```
itemShare = price × (Total − Fee) ÷ Σprice
feeShare  = Fee ÷ n                  (equal mode)
          = price × Fee ÷ Σprice     (proportional mode)
share     = itemShare + feeShare     full float precision, no rounding
```

Price inputs are kept as raw strings and parsed at calculation time, so partial input like `12.` never breaks the math.

## Stack

- **React 19** + React Compiler (no manual memoization)
- **TypeScript 6**
- **Vite 8**
- **Tailwind CSS 4** — CSS-first config, no `tailwind.config`
- Self-hosted variable fonts (Inter, Space Grotesk, Fira Code) — 3 woff2 files, zero third-party requests
- ESLint + Prettier

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
  types.ts              Domain types (Person, FeeMode, SplitResult)
  lib/
    split.ts            Pure split calculation
    format.ts           Number formatting (money / compact / exact)
    receipt.ts          Canvas PNG receipt renderer
    avatar.ts           Initials + name-hashed gradient
    useFlash.ts         Transient "copied!" feedback hook
  components/
    BillInputs.tsx      Total + fee inputs
    PeopleCard.tsx      People list, fee-mode toggle, add button
    PersonRow.tsx       Per-person inputs + receipt-stub share
    SummaryCard.tsx     Totals, sanity check, actions
    ReceiptModal.tsx    PNG preview + download
  App.tsx               State + composition
```
