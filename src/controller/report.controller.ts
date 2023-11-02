import { Response, Request } from "express";
import { convertSnakeCaseToCamelCase, summarizeExpenseData, summarizeIncomeData } from "../service/convertDataService";
import { StorefrontItem } from "../interface/storefront.types";
import { ExpenseItem } from "../interface/expense.types";
import dayjs from 'dayjs';

interface StartAndEndDayOfMonth {
  startDay: string;
  endDay: string;
}

function getStartDayOfMonthAndEndDayOfMonth(dateString: string): StartAndEndDayOfMonth {
  const startDate = dayjs(dateString).startOf('month').format('YYYY-MM-DD');
  const endDate = dayjs(dateString).endOf('month').format('YYYY-MM-DD');
  return { startDay: startDate, endDay: endDate };
}

export const getDailyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  const convertedDate = new Date(date).toISOString();

  // console.log('convertedDate', convertedDate);

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
      message: error.error.message,
      error
    });
  }

};

export const getMonthlyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;

  function getStartDayOfMonthAndEndDayOfMonth(dateString: string): StartAndEndDayOfMonth {
    const startDate = dayjs(dateString).startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs(dateString).endOf('month').format('YYYY-MM-DD');
    return { startDay: startDate, endDay: endDate };
  }
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
    const sumExpense = responseData?.reduce((acc, item) => acc += item.sum_expense, 0)|| 0;;
    const sumNetIncome = responseData?.reduce((acc, item) => acc += item.net_income, 0)|| 0;;

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
      message: error.error.message,
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

    const sumStorefront = responseData?.reduce((acc, item) => acc += item.sum_storefront, 0) || 0;
    const sumLeftover = responseData?.reduce((acc, item) => acc += item.sum_leftover, 0)|| 0;;

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: {
        sumStorefront: sumStorefront.toLocaleString(),
        sumLeftover: sumLeftover.toLocaleString(),
        data: responseData,
      }
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.error.message,
      error
    });
  }

};