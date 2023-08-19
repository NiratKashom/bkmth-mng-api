export interface TitleItem {
  title: string;
  category: string;
  unit: string;
}

export interface StorefrontItem extends TitleItem {
  id: number;
  date: string;
  createdAt?: string;
  qty: number;
  remark: string;
  totalPrice: number;
  isLeftover: boolean;
  leftoverAmount: number;
  leftoverTotalPrice: number;
}

export interface LeftoverItem extends TitleItem {
  storefrontId: number;
  leftoverAmount: number;
  leftoverTotalPrice: number;
}

export interface IncomeItem extends TitleItem {
  storefrontId: number;
  incomeAmount: number;
  incomeTotalPrice: number;
}

export interface Summary<T> {
  amountItems: string;
  sumTotalPrice: string;
  data: T[];
}

export type SummarySf = Summary<StorefrontItem>;
export type SummaryLo = Summary<LeftoverItem>;
export type SummaryIc = Summary<IncomeItem>;