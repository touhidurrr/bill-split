export interface Person {
  id: string;
  name: string;
  /** Raw input string; parsed on calculation so partial input ("12.") never breaks. */
  price: string;
}

export type FeeMode = "equal" | "proportional";

export interface PersonShare {
  person: Person;
  itemShare: number;
  feeShare: number;
  /** itemShare + feeShare, full float precision — poi poi hisab. */
  total: number;
  /** Share of the food bill, 0–100. */
  percent: number;
}

export interface SplitResult {
  shares: PersonShare[];
  sumItemPrice: number;
  foodPrice: number;
  sumItemShare: number;
  sumFeeShare: number;
  sumTotal: number;
  matchesBill: boolean;
}
