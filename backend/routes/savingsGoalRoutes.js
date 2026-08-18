import express from 'express';
import { getAllSavingsGoals, getSavingsGoalById } from '../controllers/savingsGoalController.js';

const router = express.Router();

router.get('/', getAllSavingsGoals);
router.get('/:id', getSavingsGoalById);

export default router;
