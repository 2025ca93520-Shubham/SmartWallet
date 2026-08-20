export class Expense {
  constructor(
    id,
    expenseName,
    amount,
    category,
    date,
    paymentMethod,
    createdAt = new Date().toISOString(),
    updatedAt = createdAt
  ) {
    this.id = id;
    this.expenseName = expenseName;
    this.description = expenseName;
    this.amount = amount;
    this.category = category;
    this.date = date;
    this.paymentMethod = paymentMethod;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static resolveExpenseName(data) {
    return (data.expenseName || data.description || '').toString().trim();
  }

  static isValidDate(value) {
    if (!value) {
      return false;
    }

    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  }

  static validate(data) {
    const errors = [];
    const expenseName = Expense.resolveExpenseName(data);

    if (!expenseName) errors.push('Expense Name is required');
    if (data.amount === undefined || data.amount === null || Number(data.amount) <= 0) {
      errors.push('Amount must be positive');
    }
    if (!data.category) errors.push('Category is required');
    if (!Expense.isValidDate(data.date)) errors.push('Date must be valid');
    if (!data.paymentMethod) errors.push('Payment Method is required');
    return errors;
  }
}
