import express from 'express';
import {
  getAllSavingsGoals,
  getSavingsGoalById,
  addFundsToSavingsGoal,
} from '../controllers/savingsGoalController.js';

const router = express.Router();

router.get('/', getAllSavingsGoals);
router.get('/:id', getSavingsGoalById);
router.post('/:id/add-funds', addFundsToSavingsGoal);

export default router;
