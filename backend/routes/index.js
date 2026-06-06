import express from 'express';
import transactionRoutes from './transactionRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
