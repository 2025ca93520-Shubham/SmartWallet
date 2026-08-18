import { expenseService } from '../services/expenseService.js';
import { dataStore } from '../services/dataStore.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { expensesToCsv } from '../utils/csvFormatter.js';

export const getAllExpenses = (req, res, next) => {
  try {
    const expenses = expenseService.getAll();
    successResponse(res, expenses);
  } catch (error) {
    next(error);
  }
};

export const exportExpenses = (req, res, next) => {
  try {
    const expenses = expenseService.getAll();
    const filteredExpenses = req.query.category && req.query.category !== 'all'
      ? expenses.filter((expense) => expense.category === req.query.category)
      : expenses;

    res.type('text/csv');
    res.attachment('expenses.csv');
    res.send(expensesToCsv(filteredExpenses));
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = (req, res, next) => {
  try {
    const expense = expenseService.getById(req.params.id);
    if (!expense) {
      return errorResponse(res, 'Expense not found', 404);
    }
    successResponse(res, expense);
  } catch (error) {
    next(error);
  }
};

export const createExpense = (req, res, next) => {
  try {
    const expense = expenseService.create(req.body);
    dataStore.save();
    successResponse(res, expense, 201);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = (req, res, next) => {
  try {
    const expense = expenseService.update(req.params.id, req.body);
    dataStore.save();
    successResponse(res, expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = (req, res, next) => {
  try {
    const expense = expenseService.delete(req.params.id);
    dataStore.save();
    successResponse(res, expense);
  } catch (error) {
    next(error);
  }
};
