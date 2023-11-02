import express from 'express';
import { getDailyReport,getMonthlyReport,getLeftoverMonthlyReport } from '../controller/report.controller';
import { getTokenMiddleware } from '../middleware/token';

const router = express.Router();

router.route('/daily/:date').get(getTokenMiddleware, getDailyReport);
router.route('/monthly/:date').get(getTokenMiddleware, getMonthlyReport);
router.route('/monthly/leftover/:date').get(getTokenMiddleware, getLeftoverMonthlyReport);

export default router