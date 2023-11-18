export interface StartAndEndDayOfMonth {
  startDay: string;
  endDay: string;
}

export interface Expense {
  date: string;
  category: string;
  sum: number;
}

export interface SummarizeByCategory {
  sum: number;
  ratio?: number;
};

export interface SummarizeExpense {
  sumExpense: number;
  sumRawMaterial: SummarizeByCategory;
  sumPackaging: SummarizeByCategory;
  sumConsume: SummarizeByCategory;
  sumOtherCosts: SummarizeByCategory;
  sumOther: SummarizeByCategory;
};