import express from 'express';
import { getDailyReport } from '../controller/report.controller';
import { getTokenMiddleware } from '../middleware/token';

const router = express.Router();

router.route('/daily/:date').get(getTokenMiddleware, getDailyReport);
// router.route('/').post(getTokenMiddleware, createStorefrontData);
// router.route('/:id').delete(getTokenMiddleware, deleteStorefrontData);

export default router