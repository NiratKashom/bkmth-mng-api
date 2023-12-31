import { Response, Request } from "express";
import { convertCamelCaseToSnakeCase, convertSnakeCaseToCamelCase, summarizeExpenseData } from "../service/convertDataService";
import { ExpenseItem } from "../interface/expense.types";

export const getExpenseByDate = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  try {
    const convertedDate = new Date(date).toISOString();
    let { data: responseData, error } = await supabase
      .from('expense')
      .select("*")
      .eq("date", convertedDate);

    if (error) throw error;

    const expenseList: ExpenseItem[] = convertSnakeCaseToCamelCase(responseData || []);
    const expenseData = summarizeExpenseData(expenseList)

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: expenseData
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error
    });
  }
};

export const createExpenseData = async (req: Request, res: Response) => {
  const supabase = req.supabase!;
  const body: ExpenseItem[] = req.body;
  const convertedBody = convertCamelCaseToSnakeCase(body);
  try {
    const response = await supabase
      .from('expense')
      .insert(convertedBody)
      .select();
    if (response.status === 400 || response.status === 404) throw response;
    const convertedData: ExpenseItem[] = convertSnakeCaseToCamelCase(response.data || []);
    res.json({
      message: "CREAT DATA SUCCESSFULLY",
      data: convertedData
    });

  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.error.message,
      error
    });
  }

};

export const deleteExpenseData = async (req: Request, res: Response) => {
  const supabase = req.supabase!;
  const id: string = req.params.id;
  try {
    const response = await supabase
      .from('expense')
      .delete()
      .eq('id', id);
    if (response.status === 400 || response.status === 404) throw response;
    res.json({
      message: "DETELED DATA SUCCESSFULLY",
      response
    });
  } catch (error: any) {
    res.status(500).json({
      statusText: error.statusText,
      message: error.error.message,
      error
    });
  }
};

// PUT method
// export const handlePutRequest = async (req: Request, res: Response) => {
//   try {
//     // Your logic to handle PUT request goes here
//     const id = req.params.id;
//     const updatedData = req.body;
//     await updateData(id, updatedData);
//     res.json({ message: 'Data updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
