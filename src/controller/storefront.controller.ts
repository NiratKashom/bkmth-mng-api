import { Response, Request } from "express";
import { convertCamelCaseToSnakeCase, convertSnakeCaseToCamelCase, summarizeStorfrontData } from "../service/convertDataService";
import { IncomeItem, LeftoverItem, StorefrontItem, SummaryIc, SummaryLo, SummarySf } from "../interface/storefront.types";

export const getStorefrontByDate = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const supabase = req.supabase!;
  const date: string = req.params.date;
  try {
    const convertedDate = new Date(date).toISOString();
    let { data: responseData, error } = await supabase
      .from('storefront')
      .select("*")
      .eq("date", convertedDate);
    if (error) throw error;

    const storefrontList = convertSnakeCaseToCamelCase(responseData || []);
    const summarySfData = summarizeStorfrontData(storefrontList);

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: summarySfData
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error
    });
  }
};

export const createStorefrontData = async (req: Request, res: Response) => {
  const supabase = req.supabase!;
  const body = req.body;
  const convertedBody = convertCamelCaseToSnakeCase(body);
  try {
    const response = await supabase
      .from('storefront')
      .insert(convertedBody)
      .select();
    if (response.status === 400 || response.status === 404) throw response;
    const convertedData: StorefrontItem[] = convertSnakeCaseToCamelCase(response.data || []);
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

export const deleteStorefrontData = async (req: Request, res: Response) => {
  const supabase = req.supabase!;
  const id: string = req.params.id;
  // res.json({
  //   message: "DETELED DATA SUCCESSFULLY",
  //   id
  // });
  try {
    const response = await supabase
      .from('storefront')
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


// const MOCK_POST = [{
//   category: "ขนมถ้วยฟู",
//   date: "2023-04-30T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 22,
//   remark: "",
//   title: "ถุงเล็ก 5 ลูก",
//   total_price: 440,
//   unit: "ถุง"
// }, {
//   category: "ขนมถ้วยฟู",
//   date: "2023-04-30T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 6,
//   remark: "",
//   title: "ถุงใหญ่ 12 ลูก",
//   total_price: 300,
//   unit: "ถุง"
// }, {
//   category: "ขนมมัน",
//   date: "2023-04-30T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 3,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 45,
//   unit: "ถุง"
// }, {
//   category: "ขนมมัน",
//   date: "2023-04-30T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 10,
//   remark: "",
//   title: "จัดเบรคกล่องเล็ก",
//   total_price: 200,
//   unit: "กล่อง"
// }, {
//   category: "ขนมต้ม",
//   date: "2023-04-30T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 1,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 15,
//   unit: "ถุง"
// }, {
//   category: "ขนมตาล",
//   date: "2023-04-30T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 6,
//   remark: "ขนมตาล ถุงเล็ก 20 บาท",
//   title: "ถุงเล็ก",
//   total_price: 120,
//   unit: "ถุง"
// }, {
//   category: "ขนมถ้วยฟู",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 23,
//   remark: "",
//   title: "ถุงเล็ก 5 ลูก",
//   total_price: 460,
//   unit: "ถุง"
// }, {
//   category: "ขนมถ้วยฟู",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 6,
//   remark: "",
//   title: "ถุงใหญ่ 12 ลูก",
//   total_price: 300,
//   unit: "ถุง"
// }, {
//   category: "ขนมมัน",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 3,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 45,
//   unit: "ถุง"
// }, {
//   category: "ขนมต้ม",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 10,
//   remark: "",
//   title: "กล่องเล็ก",
//   total_price: 200,
//   unit: "กล่อง"
// }, {
//   category: "ข้าวต้มหัวหงอก",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 8,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 120,
//   unit: "ถุง"
// }, {
//   category: "ขนมตาล",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 6,
//   remark: "ขนมตาล ถุงเล็ก 20 บาท",
//   title: "ถุงเล็ก",
//   total_price: 120,
//   unit: "ถุง"
// }, {
//   category: "ขนมมัน",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 8,
//   remark: "",
//   title: "จัดเบรคกล่องเล็ก",
//   total_price: 160,
//   unit: "กล่อง"
// }, {
//   category: "ข้าวต้มหัวหงอก",
//   date: "2023-05-01T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 5,
//   remark: "",
//   title: "กล่องเล็ก",
//   total_price: 100,
//   unit: "กล่อง"
// }, {
//   category: "ขนมถ้วยฟู",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: true,
//   leftover_amount: 1,
//   leftover_total_price: 20,
//   qty: 30,
//   remark: "ถุงละ 20 บาท",
//   title: "ถุงเล็ก 5 ลูก",
//   total_price: 600,
//   unit: "ถุง"
// }, {
//   category: "ขนมถ้วยฟู",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 6,
//   remark: "ถุงละ 50บาท",
//   title: "ถุงใหญ่ 12 ลูก",
//   total_price: 300,
//   unit: "ถุง"
// }, {
//   category: "ขนมถ้วยฟู",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 1,
//   remark: "ลูกค้าสั่ง",
//   title: "อื่นๆ",
//   total_price: 100,
//   unit: "กล่อง"
// }, {
//   category: "ขนมมัน",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 2,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 30,
//   unit: "ถุง"
// }, {
//   category: "ขนมมัน",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 10,
//   remark: "",
//   title: "จัดเบรคกล่องเล็ก",
//   total_price: 200,
//   unit: "กล่อง"
// }, {
//   category: "ขนมต้ม",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 2,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 30,
//   unit: "ถุง"
// }, {
//   category: "ขนมต้ม",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 10,
//   remark: "",
//   title: "กล่องเล็ก",
//   total_price: 200,
//   unit: "กล่อง"
// }, {
//   category: "ข้าวต้มหัวหงอก",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 8,
//   remark: "",
//   title: "ถุงเล็ก",
//   total_price: 120,
//   unit: "ถุง"
// }, {
//   category: "ข้าวต้มหัวหงอก",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 4,
//   remark: "",
//   title: "กล่องเล็ก",
//   total_price: 80,
//   unit: "กล่อง"
// }, {
//   category: "ขนมตาล",
//   date: "2023-05-02T17:00:00.000Z",
//   is_leftover: false,
//   leftover_amount: 0,
//   leftover_total_price: 0,
//   qty: 6,
//   remark: "ขนมตาล ถุงเล็ก 20 บาท",
//   title: "ถุงเล็ก",
//   total_price: 120,
//   unit: "ถุง"
// }]