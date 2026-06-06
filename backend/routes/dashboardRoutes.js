import express from 'express';
import {
  getDashboardSummary,
  getMonthlyTrends,
  getCategoryComparison,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', getDashboardSummary);
router.get('/trends', getMonthlyTrends);
router.get('/category-comparison', getCategoryComparison);

export default router;
