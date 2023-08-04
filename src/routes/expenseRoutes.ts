import express from 'express';
import { createExpenseData, deleteExpenseData, getExpenseByDate } from '../controller/expense.controller';
const router = express.Router();

router.route('/:date').get(getExpenseByDate);
router.route('/').post(createExpenseData);
router.route('/:id').delete(deleteExpenseData);

export default router