export class SavingsGoal {
  constructor(id, name, targetAmount, targetDate, currentAmount) {
    this.id = id;
    this.name = name;
    this.targetAmount = targetAmount;
    this.targetDate = targetDate;
    this.currentAmount = currentAmount;
  }

  static remainingAmount(goal) {
    return Math.max(0, goal.targetAmount - goal.currentAmount);
  }

  static progressPercentage(goal) {
    if (!goal.targetAmount) return 0;
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  }

  static withProgress(goal) {
    return {
      ...goal,
      remainingAmount: SavingsGoal.remainingAmount(goal),
      progressPercentage: SavingsGoal.progressPercentage(goal),
    };
  }

  static validateFunds(data, goal) {
    const errors = [];
    const amount = Number(data.amount);
    if (data.amount === undefined || data.amount === null || Number.isNaN(amount)) {
      errors.push('Amount is required and must be a number');
    } else if (amount <= 0) {
      errors.push('Amount must be positive');
    } else if (goal && goal.currentAmount + amount > goal.targetAmount) {
      errors.push('Amount exceeds savings goal target');
    }
    return errors;
  }
}