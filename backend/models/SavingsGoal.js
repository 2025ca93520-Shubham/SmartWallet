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
}
