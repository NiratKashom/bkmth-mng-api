import { ExpenseItem, SummaryExpense } from "../interface/expense.types";
import { IncomeItem, LeftoverItem, StorefrontItem, SummaryIc, SummaryLo, SummarySf } from "../interface/storefront.types";

export const convertSnakeCaseToCamelCase = (arr: any[]): any[] => {
  return arr.map((obj) => {
    const camelCaseObj: any = {};
    for (const snakeCaseKey in obj) {
      if (snakeCaseKey.includes("_")) {
        const camelCaseKey = snakeCaseKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseObj[camelCaseKey] = obj[snakeCaseKey];
      } else {
        camelCaseObj[snakeCaseKey] = obj[snakeCaseKey];
      }
    }
    return camelCaseObj;
  });
};

export const convertCamelCaseToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertCamelCaseToSnakeCase(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const convertedObj: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        convertedObj[snakeCaseKey] = convertCamelCaseToSnakeCase(obj[key]);
      }
    }

    return convertedObj;
  }

  return obj;
};

export const summarizeStorfrontData = (storefrontList: StorefrontItem[]) => {
  let leftoverList: LeftoverItem[] = [];
  let incomeList: IncomeItem[] = [];
  let sfAmountItems: number = 0;
  let loAmountItems: number = 0;
  let icAmountItems: number = 0;
  let sfTotalPrice: number = 0;
  let loTotalPrice: number = 0;
  let icTotalPrice: number = 0;

  storefrontList?.forEach(({
    id: storefrontId,
    title,
    category,
    qty,
    totalPrice,
    isLeftover,
    unit,
    leftoverAmount,
    leftoverTotalPrice
  }: StorefrontItem) => {
    sfAmountItems++;
    sfTotalPrice += totalPrice;
    if (isLeftover) {
      loAmountItems++;
      loTotalPrice += leftoverTotalPrice;
      leftoverList.push({
        storefrontId,
        title,
        category,
        unit,
        leftoverAmount,
        leftoverTotalPrice,
      });
    }
    let incomeItem: IncomeItem = {
      storefrontId,
      title,
      unit,
      category,
      incomeAmount: qty - leftoverAmount,
      incomeTotalPrice: totalPrice - leftoverTotalPrice
    };
    icAmountItems++;
    icTotalPrice += incomeItem.incomeTotalPrice;
    incomeList.push(incomeItem);

  });

  const storefrontData: SummarySf = {
    amountItems: sfAmountItems.toLocaleString(),
    sumTotalPrice: sfTotalPrice.toLocaleString(),
    data: storefrontList,
  };
  const leftoverData: SummaryLo = {
    amountItems: loAmountItems.toLocaleString(),
    sumTotalPrice: loTotalPrice.toLocaleString(),
    data: leftoverList,
  };
  const incomeData: SummaryIc = {
    amountItems: icAmountItems.toLocaleString(),
    sumTotalPrice: icTotalPrice.toLocaleString(),
    data: incomeList,
  };

  return {
    storefrontData,
    leftoverData,
    incomeData,
  };
};

export const summarizeExpenseData = (expenseList: ExpenseItem[]): SummaryExpense => {
  let amountItems: string = expenseList.length.toLocaleString();
  let sumTotalPrice: string = expenseList.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString();
  return {
    amountItems,
    sumTotalPrice,
    data: expenseList
  };
};

export const summarizeIncomeData = (storefrontList: StorefrontItem[]): SummaryIc => {
  const icData: IncomeItem[] = [];
  let icAmountItems = 0;
  let icSumTotalPrice = 0;

  storefrontList.forEach((item) => {
    if (item.totalPrice - item.leftoverTotalPrice === 0) return;
    let netQty = Number(item.qty) - Number(item.leftoverAmount);
    let netTotalPrice = Number(item.totalPrice) - Number(item.leftoverTotalPrice);
    icAmountItems++;
    icSumTotalPrice += netTotalPrice;
    icData.push({
      storefrontId: item.id,
      title: item.title,
      category: item.category,
      unit: item.unit,
      incomeAmount: netQty,
      incomeTotalPrice: netTotalPrice,
    });
  });

  return {
    data: icData,
    amountItems: icAmountItems.toLocaleString(),
    sumTotalPrice: icSumTotalPrice.toLocaleString()
  };
};
