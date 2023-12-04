import { Response, Request } from "express";
import { convertSnakeCaseToCamelCase, summarizeExpenseData, summarizeIncomeData } from "../service/convertDataService";
import { getStartDayOfMonthAndEndDayOfMonth, updateExpense, calcRatio } from "../service/extractDataForReportService";
import { StorefrontItem } from "../interface/storefront.types";
import { ExpenseItem } from "../interface/expense.types";
import { Expense, SummarizeExpense } from "../interface/report.types";

export const getDailyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  const convertedDate = new Date(date).toISOString();

  try {
    const queries = [
      supabase.from('storefront').select('id, title, category,remark, qty, total_price, is_leftover, unit, leftover_amount, leftover_total_price').eq('date', convertedDate),
      supabase.from('expense').select('id, title,unit, category,remark, qty, total_price').eq('date', convertedDate),
    ];

    const [storefrontData, expenseData] = await Promise.all(queries);
    const storefrontList: StorefrontItem[] = convertSnakeCaseToCamelCase(storefrontData.data || []);
    const expenseList: ExpenseItem[] = convertSnakeCaseToCamelCase(expenseData.data || []);
    const summaryIncomeData = summarizeIncomeData(storefrontList);
    const summaryExpense = summarizeExpenseData(expenseList);

    console.log('expenseData', expenseData);

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: {
        storefront: summaryIncomeData,
        expense: summaryExpense
      }
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.message,
      error
    });
  }

};

export const getMonthlyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;

  const { startDay, endDay } = getStartDayOfMonthAndEndDayOfMonth(date);
  try {

    let { data: responseData, error } = await supabase
      .from('daily_summary_report')
      .select('date, sum_income,sum_expense,net_income')
      .gte('date', startDay)
      .lte('date', endDay)
      .order('date', { ascending: true });

    if (error) throw error;

    const sumIncome = responseData?.reduce((acc, item) => acc += item.sum_income, 0) || 0;
    const sumExpense = responseData?.reduce((acc, item) => acc += item.sum_expense, 0) || 0;;
    const sumNetIncome = responseData?.reduce((acc, item) => acc += item.net_income, 0) || 0;;

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: {
        sumIncome: sumIncome.toLocaleString(),
        sumExpense: sumExpense.toLocaleString(),
        sumNetIncome: sumNetIncome.toLocaleString(),
        data: responseData,
      }
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.message,
      error
    });
  }

};

export const getLeftoverMonthlyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;

  const { startDay, endDay } = getStartDayOfMonthAndEndDayOfMonth(date);
  try {

    let { data: responseData, error } = await supabase
      .from('daily_summary_report')
      .select('date, sum_storefront,sum_leftover')
      .gte('date', startDay)
      .lte('date', endDay)
      .order('date', { ascending: true });

    if (error) throw error;

    const sumStorefront: number = responseData?.reduce((acc, item) => acc += item.sum_storefront, 0) || 0;
    const sumLeftover: number = responseData?.reduce((acc, item) => acc += item.sum_leftover, 0) || 0;
    const leftoverRatio: number = (sumLeftover / sumStorefront) * 100;

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: {
        sumStorefront: sumStorefront.toLocaleString(),
        sumLeftover: sumLeftover.toLocaleString(),
        leftoverRatio: leftoverRatio.toFixed(1),
        data: responseData,
      }
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.message,
      error
    });
  }

};

export const getExpenseMonthlyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  const { startDay, endDay } = getStartDayOfMonthAndEndDayOfMonth(date);
  const [year, month]: string[] = date.split('-');

  try {
    let { data: responseData, error } = await supabase
      .from('daily_sum_expense_by_category')
      .select('*')
      .gte('date', startDay)
      .lte('date', endDay)
      .order('date', { ascending: true });

    let { data: expByTitle, error: fnError } = await supabase
      .rpc('get_expense_summary_by_title', { p_month: Number(month), p_year: Number(year) });

    if (error || fnError) throw error;

    let summarizeExpenseData: SummarizeExpense = {
      sumExpense: 0,
      sumRawMaterial: {
        sum: 0
      },
      sumPackaging: {
        sum: 0
      },
      sumConsume: {
        sum: 0
      },
      sumOtherCosts: {
        sum: 0
      },
      sumOther: {
        sum: 0
      },
    };

    const expenseData = responseData?.reduce((acc: any[], item: Expense, idx: number) => {
      const { date, category, sum } = item;
      const lastIndex = acc.length - 1;

      if (lastIndex >= 0 && acc[lastIndex].date === date) {
        updateExpense(acc, lastIndex, category, sum, summarizeExpenseData);
        if (responseData && idx === responseData.length - 1) {
          const { sumExpense, sumRawMaterial, sumPackaging, sumConsume, sumOtherCosts, sumOther } = summarizeExpenseData;
          sumRawMaterial.ratio = calcRatio(sumRawMaterial.sum, sumExpense);
          sumPackaging.ratio = calcRatio(sumPackaging.sum, sumExpense);
          sumConsume.ratio = calcRatio(sumConsume.sum, sumExpense);
          sumOtherCosts.ratio = calcRatio(sumOtherCosts.sum, sumExpense);
          sumOther.ratio = calcRatio(sumOther.sum, sumExpense);
        }
      } else {
        const eachList = {
          date,
          expList: {
            rawMaterial: 0,
            packaging: 0,
            consume: 0,
            otherCosts: 0,
            other: 0
          }
        };
        updateExpense([eachList], 0, category, sum, summarizeExpenseData);
        acc.push(eachList);
      }
      return acc;
    }, []);

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: { expenseData, summarizeExpenseData, expByTitle }
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.message,
      error
    });
  }

};

export const getExpenseDailyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  const convertedDate = new Date(date).toISOString();

  try {
    let { data: responseData, error } = await supabase
      .from('expense')
      .select('date,category,title,qty,unit,total_price')
      .eq('date', convertedDate)
      .order('total_price', { ascending: false });

    if (error) throw error;

    let summarizeExpenseData: SummarizeExpense = {
      sumExpense: 0,
      sumRawMaterial: {
        sum: 0
      },
      sumPackaging: {
        sum: 0
      },
      sumConsume: {
        sum: 0
      },
      sumOtherCosts: {
        sum: 0
      },
      sumOther: {
        sum: 0
      },
    };

    const convertedExpList: ExpenseItem[] = convertSnakeCaseToCamelCase(responseData || []);
    convertedExpList.forEach((item: ExpenseItem) => {
      const { category, totalPrice = 0 } = item;
      switch (category) {
        case "วัตถุดิบ":
          summarizeExpenseData.sumRawMaterial.sum += totalPrice;
          break;
        case "บรรจุภัณฑ์":
          summarizeExpenseData.sumPackaging.sum += totalPrice;
          break;
        case "บริโภค":
          summarizeExpenseData.sumConsume.sum += totalPrice;
          break;
        case "ต้นทุนอื่นๆ":
          summarizeExpenseData.sumOtherCosts.sum += totalPrice;
          break;
        case "อื่นๆ":
          summarizeExpenseData.sumOther.sum += totalPrice;
          break;
      }
      summarizeExpenseData.sumExpense += totalPrice;
    });

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: { expenseList: convertedExpList, summarizeExpense: summarizeExpenseData }
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.message,
      error
    });
  }

};