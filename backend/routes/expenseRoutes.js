import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
  exportExpenseReport,
} from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', getAllExpenses);
router.get('/export', exportExpenses);
router.get('/report', exportExpenseReport);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
