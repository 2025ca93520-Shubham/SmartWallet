export class Expense {
  constructor(id, amount, category, description, date, paymentMethod, isRecurring, notes) {
    this.id = id;
    this.amount = amount;
    this.category = category;
    this.description = description;
    this.date = date;
    this.paymentMethod = paymentMethod;
    this.isRecurring = isRecurring;
    this.notes = notes;
  }

  static validate(data) {
    const errors = [];
    if (!data.amount || data.amount <= 0) errors.push('Amount must be positive');
    if (!data.category) errors.push('Category is required');
    if (!data.description) errors.push('Description is required');
    if (!data.date) errors.push('Date is required');
    return errors;
  }
}
