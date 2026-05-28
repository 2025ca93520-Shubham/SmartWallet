export class Transaction {
  constructor(id, amount, category, description, date, type = 'expense') {
    this.id = id;
    this.amount = amount;
    this.category = category;
    this.description = description;
    this.date = date;
    this.type = type;
  }

  static validate(data) {
    const errors = [];
    if (!data.amount || data.amount <= 0) errors.push('Amount must be positive');
    if (!data.category) errors.push('Category is required');
    if (!data.description) errors.push('Description is required');
    if (!data.date) errors.push('Date is required');
    if (!['income', 'expense'].includes(data.type)) errors.push('Type must be income or expense');
    return errors;
  }
}
