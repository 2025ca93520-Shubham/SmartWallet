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
}

export const savingsGoalService = new SavingsGoalService();
