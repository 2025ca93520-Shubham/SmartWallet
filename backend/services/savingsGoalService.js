import { SavingsGoal } from '../models/SavingsGoal.js';
import { dataStore } from './dataStore.js';

export class SavingsGoalService {
  getAll() {
    return dataStore.data.savingsGoals.map((goal) => SavingsGoal.withProgress(goal));
  }

  getById(id) {
    const goal = dataStore.data.savingsGoals.find((g) => g.id === id);
    return goal ? SavingsGoal.withProgress(goal) : undefined;
  }

  addFunds(id, data) {
    const rawGoal = dataStore.data.savingsGoals.find((g) => g.id === id);
    if (!rawGoal) {
      const error = new Error('Savings goal not found');
      error.statusCode = 404;
      throw error;
    }

    const errors = SavingsGoal.validateFunds(data, rawGoal);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    rawGoal.currentAmount += Number(data.amount);
    return SavingsGoal.withProgress(rawGoal);
  }
}

export const savingsGoalService = new SavingsGoalService();