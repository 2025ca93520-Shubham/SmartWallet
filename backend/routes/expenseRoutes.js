import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
} from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', getAllExpenses);
router.get('/export', exportExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
