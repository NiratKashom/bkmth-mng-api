import express from 'express';
import { getDailyReport,getMonthlyReport,getLeftoverMonthlyReport,getExpenseMonthlyReport,getExpenseDailyReport } from '../controller/report.controller';
import { getTokenMiddleware } from '../middleware/token';

const router = express.Router();

router.route('/daily/:date').get(getTokenMiddleware, getDailyReport);
router.route('/daily/expense/:date').get(getTokenMiddleware, getExpenseDailyReport);
router.route('/monthly/:date').get(getTokenMiddleware, getMonthlyReport);
router.route('/monthly/leftover/:date').get(getTokenMiddleware, getLeftoverMonthlyReport);
router.route('/monthly/expense/:date').get(getTokenMiddleware, getExpenseMonthlyReport);


export default router