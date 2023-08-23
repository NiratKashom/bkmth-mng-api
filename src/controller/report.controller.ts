import { Response, Request } from "express";
import { convertSnakeCaseToCamelCase, summarizeExpenseData, summarizeIncomeData } from "../service/convertDataService";
import { StorefrontItem } from "../interface/storefront.types";
import { ExpenseItem } from "../interface/expense.types";
import dayjs from 'dayjs';

interface StartAndEndDayOfMonth {
  startDay: string;
  endDay: string;
}
export const getDailyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  const convertedDate = new Date(date).toISOString();

  console.log('convertedDate', convertedDate);

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
  console.log('formattedStartDate', startDay);
  console.log('endDAte', endDay);
  try {

    let { data: responseData, error } = await supabase
      .from('daily_summary_report')
      .select('*')
      .gte('date', startDay)
      .lte('date', endDay)
      .order('date', { ascending: true });

    if (error) throw error;

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: {
        monthly: responseData
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