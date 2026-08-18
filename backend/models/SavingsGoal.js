export class SavingsGoal {
  constructor(id, name, targetAmount, targetDate, currentAmount) {
    this.id = id;
    this.name = name;
    this.targetAmount = targetAmount;
    this.targetDate = targetDate;
    this.currentAmount = currentAmount;
  }

  static validateFunds(data) {
    const errors = [];
    const amount = Number(data.amount);
    if (data.amount === undefined || data.amount === null || Number.isNaN(amount)) {
      errors.push('Amount is required and must be a number');
    } else if (amount <= 0) {
      errors.push('Amount must be positive');
    }
    return errors;
  }
}
