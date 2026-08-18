import express from 'express';
import transactionRoutes from './transactionRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import savingsGoalRoutes from './savingsGoalRoutes.js';

const router = express.Router();

router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/savings-goals', savingsGoalRoutes);

export default router;
