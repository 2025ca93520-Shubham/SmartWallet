import { v4 as uuidv4 } from 'uuid';
import { Budget } from '../models/Budget.js';
import { dataStore } from './dataStore.js';

export class BudgetService {
  getAll() {
    return dataStore.data.budgets;
  }

  getById(id) {
    return dataStore.data.budgets.find((b) => b.id === id);
  }

  create(data) {
    const errors = Budget.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const budget = new Budget(uuidv4(), data.category, data.limit, data.month, data.year);

    dataStore.data.budgets.push(budget);
    return budget;
  }

  update(id, data) {
    const index = dataStore.data.budgets.findIndex((b) => b.id === id);
    if (index === -1) {
      const error = new Error('Budget not found');
      error.statusCode = 404;
      throw error;
    }

    const errors = Budget.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    dataStore.data.budgets[index] = {
      id,
      category: data.category,
      limit: data.limit,
      month: data.month,
      year: data.year,
    };

    return dataStore.data.budgets[index];
  }

  delete(id) {
    const index = dataStore.data.budgets.findIndex((b) => b.id === id);
    if (index === -1) {
      const error = new Error('Budget not found');
      error.statusCode = 404;
      throw error;
    }

    return dataStore.data.budgets.splice(index, 1)[0];
  }
}

export const budgetService = new BudgetService();
