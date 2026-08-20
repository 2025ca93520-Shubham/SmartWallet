import { SavingsGoal } from '../models/SavingsGoal.js';
import { dataStore } from './dataStore.js';

export class SavingsGoalService {
  getAll() {
    return dataStore.data.savingsGoals;
  }

  getById(id) {
    return dataStore.data.savingsGoals.find((g) => g.id === id);
  }

  addFunds(id, data) {
    const goal = this.getById(id);
    if (!goal) {
      const error = new Error('Savings goal not found');
      error.statusCode = 404;
      throw error;
    }

    const errors = SavingsGoal.validateFunds(data, goal);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    goal.currentAmount += Number(data.amount);
    return goal;
  }
}

export const savingsGoalService = new SavingsGoalService();
