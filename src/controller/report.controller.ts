import { Response, Request } from "express";
import { convertSnakeCaseToCamelCase, summarizeExpenseData, summarizeIncomeData } from "../service/convertDataService";
import { StorefrontItem } from "../interface/storefront.types";
import { ExpenseItem } from "../interface/expense.types";

export const getDailyReport = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  const convertedDate = new Date(date).toISOString();

  try {
    const queries = [
      supabase.from('storefront').select('id, title, category,remark, qty, total_price, is_leftover, unit, leftover_amount, leftover_total_price').eq('date', convertedDate),
      supabase.from('expense').select('id, title, category,remark, qty, total_price').eq('date', convertedDate),
    ];

    // Execute all queries concurrently using Promise.all()
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