import type { FeeMode, Person, PersonShare, SplitResult } from "../types";
import { parseAmount } from "./format";

const MATCH_TOLERANCE = 0.01;

/**
 * Splits the bill: each person pays their proportional share of the food
 * (total − fee) plus a fee share, either equal per head or proportional
 * to item price. No rounding — full float precision.
 */
export function computeSplit(
  people: readonly Person[],
  totalBill: number,
  fee: number,
  feeMode: FeeMode,
): SplitResult {
  const sumItemPrice = people.reduce((sum, p) => sum + parseAmount(p.price), 0);
  const foodPrice = totalBill - fee;
  const headCount = people.length;

  const shares: PersonShare[] = people.map((person) => {
    const price = parseAmount(person.price);
    const weight = sumItemPrice > 0 ? price / sumItemPrice : 0;
    const itemShare = weight * foodPrice;
    const feeShare =
      feeMode === "proportional" && sumItemPrice > 0
        ? weight * fee
        : headCount > 0
          ? fee / headCount
          : 0;

    return {
      person,
      itemShare,
      feeShare,
      total: itemShare + feeShare,
      percent: weight * 100,
    };
  });

  const sumItemShare = shares.reduce((sum, s) => sum + s.itemShare, 0);
  const sumFeeShare = shares.reduce((sum, s) => sum + s.feeShare, 0);
  const sumTotal = sumItemShare + sumFeeShare;
  const target = sumItemPrice > 0 ? totalBill : fee;

  return {
    shares,
    sumItemPrice,
    foodPrice,
    sumItemShare,
    sumFeeShare,
    sumTotal,
    matchesBill: headCount > 0 && Math.abs(sumTotal - target) < MATCH_TOLERANCE,
  };
}
