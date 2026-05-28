import { budgetService } from '../services/budgetService.js';
import { dataStore } from '../services/dataStore.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

export const getAllBudgets = (req, res, next) => {
  try {
    const budgets = budgetService.getAll();
    successResponse(res, budgets);
  } catch (error) {
    next(error);
  }
};

export const getBudgetById = (req, res, next) => {
  try {
    const budget = budgetService.getById(req.params.id);
    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }
    successResponse(res, budget);
  } catch (error) {
    next(error);
  }
};

export const createBudget = (req, res, next) => {
  try {
    const budget = budgetService.create(req.body);
    dataStore.save();
    successResponse(res, budget, 201);
  } catch (error) {
    next(error);
  }
};

export const updateBudget = (req, res, next) => {
  try {
    const budget = budgetService.update(req.params.id, req.body);
    dataStore.save();
    successResponse(res, budget);
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = (req, res, next) => {
  try {
    const budget = budgetService.delete(req.params.id);
    dataStore.save();
    successResponse(res, budget);
  } catch (error) {
    next(error);
  }
};
