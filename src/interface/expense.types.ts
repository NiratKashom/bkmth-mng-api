import { TitleItem, Summary } from '../interface/storefront.types';

export interface ExpenseItem extends TitleItem {
  id?: number;
  date: string;
  createdAt?: string;
  qty: number;
  remark: string;
  totalPrice: number;
}

export type SummaryExpense = Summary<ExpenseItem>;