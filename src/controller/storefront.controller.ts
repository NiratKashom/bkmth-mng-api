import { Response, Request } from "express";
import { supabase, tokenJa, getSupabaseWithToken } from "../utils/supabase";

interface TitleItem {
  title: string;
  category: string;
  unit: string;
}

interface StorefrontItem extends TitleItem {
  id: number;
  date: string;
  createdAt: string;
  qty: number;
  remark: string;
  totalPrice: number;
  isLeftover: boolean;
  leftoverAmount: number;
  leftoverTotalPrice: number;
}

interface LeftoverItem extends TitleItem {
  storefrontId: number;
  leftoverAmount: number;
  leftoverTotalPrice: number;
}

interface IncomeItem extends TitleItem {
  storefrontId: number;
  incomeAmount: number;
  incomeTotalPrice: number;
}

interface Summary<T> {
  amountItems: string;
  sumTotalPrice: string;
  data: T[];
}

type SummarySf = Summary<StorefrontItem>;
type SummaryLo = Summary<LeftoverItem>;
type SummaryIc = Summary<IncomeItem>;


const convertSnakeCaseToCamelCase = (arr: any[]): any[] => {
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

function convertCamelCaseToSnakeCase(obj: any): any {
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
}

export const getStorefrontByDate = async (req: Request, res: Response) => {
  // date should format: YYYY-MM-DD
  const date: string = req.params.date;
  try {
    const convertedDate = new Date(date).toISOString();
    let { data: responseData, error } = await supabase
      .from('storefront')
      .select("*")
      .eq("date", convertedDate);
    if (error) throw error;

    const storefrontList = convertSnakeCaseToCamelCase(responseData || []);
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

    res.json({
      message: "GET DATA SUCCESSFULLY",
      data: {
        storefrontData,
        leftoverData,
        incomeData,
      }
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error
    });
  }
};

export const createStorefrontData = async (req: Request, res: Response) => {
  const body: string = req.body;
  const convertedBody = convertCamelCaseToSnakeCase(body);
  try {
    const response = await supabase
      .from('storefront')
      .insert(convertedBody)
      .select();
    if (response.status === 400 || response.status === 404) throw response;
    res.json({
      message: "CREAT DATA SUCCESSFULLY",
      data: response.data
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
  const id: string = req.params.id;
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