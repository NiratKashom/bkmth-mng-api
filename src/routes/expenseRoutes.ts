import express from 'express';
import { createExpenseData, deleteExpenseData, getExpenseByDate } from '../controller/expense.controller';
import { getTokenMiddleware } from '../middleware/token';

const router = express.Router();

router.route('/:date').get(getTokenMiddleware, getExpenseByDate);
router.route('/').post(getTokenMiddleware, createExpenseData);
router.route('/:id').delete(getTokenMiddleware, deleteExpenseData);

export default router;