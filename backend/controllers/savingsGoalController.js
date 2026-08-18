import { savingsGoalService } from '../services/savingsGoalService.js';
import { dataStore } from '../services/dataStore.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

export const getAllSavingsGoals = (req, res, next) => {
  try {
    const goals = savingsGoalService.getAll();
    successResponse(res, goals);
  } catch (error) {
    next(error);
  }
};

export const getSavingsGoalById = (req, res, next) => {
  try {
    const goal = savingsGoalService.getById(req.params.id);
    if (!goal) {
      return errorResponse(res, 'Savings goal not found', 404);
    }
    successResponse(res, goal);
  } catch (error) {
    next(error);
  }
};

export const addFundsToSavingsGoal = (req, res, next) => {
  try {
    const goal = savingsGoalService.addFunds(req.params.id, req.body);
    dataStore.save();
    successResponse(res, goal);
  } catch (error) {
    next(error);
  }
};