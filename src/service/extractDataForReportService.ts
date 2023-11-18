import dayjs from 'dayjs';
import { StartAndEndDayOfMonth,SummarizeExpense } from "../interface/report.types";

export const getStartDayOfMonthAndEndDayOfMonth = (dateString: string): StartAndEndDayOfMonth => {
  const startDate = dayjs(dateString).startOf('month').format('YYYY-MM-DD');
  const endDate = dayjs(dateString).endOf('month').format('YYYY-MM-DD');
  return { startDay: startDate, endDay: endDate };
}

export const updateExpense = (acc: any[], lastIndex: number, category: string, sum: number, summarizeExp: SummarizeExpense) => {
  switch (category) {
    case "วัตถุดิบ":
      acc[lastIndex].expList.rawMaterial = sum;
      summarizeExp.sumRawMaterial.sum += sum;
      summarizeExp.sumExpense += sum;
      break;
    case "บรรจุภัณฑ์":
      acc[lastIndex].expList.packaging = sum;
      summarizeExp.sumPackaging.sum += sum;
      summarizeExp.sumExpense += sum;

      break;
    case "บริโภค":
      acc[lastIndex].expList.consume = sum;
      summarizeExp.sumConsume.sum += sum;
      summarizeExp.sumExpense += sum;
      break;
    case "ต้นทุนอื่นๆ":
      acc[lastIndex].expList.otherCosts = sum;
      summarizeExp.sumOtherCosts.sum += sum;
      summarizeExp.sumExpense += sum;
      break;
    case "อื่นๆ":
      acc[lastIndex].expList.other = sum;
      summarizeExp.sumOther.sum += sum;
      summarizeExp.sumExpense += sum;
      break;
    default:
      break;
  }
};

export const calcRatio = (num: number, total: number): number => {
  return Number(((num / total) * 100).toFixed(1));
};
