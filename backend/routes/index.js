import express from 'express';
import transactionRoutes from './transactionRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const router = express.Router();

router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/categories', categoryRoutes);

export default router;
