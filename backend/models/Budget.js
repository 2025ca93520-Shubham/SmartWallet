export class Budget {
  constructor(id, category, limit, month, year) {
    this.id = id;
    this.category = category;
    this.limit = limit;
    this.month = month;
    this.year = year;
  }

  static validate(data) {
    const errors = [];
    if (!data.category) errors.push('Category is required');
    if (!data.limit || data.limit <= 0) errors.push('Limit must be positive');
    if (!data.month || data.month < 1 || data.month > 12) errors.push('Month must be 1-12');
    if (!data.year || data.year < 2020) errors.push('Year must be valid');
    return errors;
  }
}
