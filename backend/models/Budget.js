export class Budget {
  constructor(id, category, limit, month, year, startMonth, startYear, endMonth, endYear) {
    this.id = id;
    this.category = category;
    this.limit = limit;
    this.month = month;
    this.year = year;
    this.startMonth = startMonth;
    this.startYear = startYear;
    this.endMonth = endMonth;
    this.endYear = endYear;
  }

  static validate(data) {
    const errors = [];
    if (!data.category) errors.push('Category is required');
    if (!data.limit || data.limit <= 0) errors.push('Limit must be positive');

    const hasSingleMonth = data.month && data.year;
    const hasRange = data.startMonth && data.startYear && data.endMonth && data.endYear;

    if (!hasSingleMonth && !hasRange) {
      errors.push('Either month/year or startMonth/startYear/endMonth/endYear must be provided');
      return errors;
    }

    if (hasSingleMonth) {
      if (data.month < 1 || data.month > 12) errors.push('Month must be 1-12');
      if (data.year < 2020) errors.push('Year must be valid');
    }

    if (hasRange) {
      if (data.startMonth < 1 || data.startMonth > 12) errors.push('Start month must be 1-12');
      if (data.endMonth < 1 || data.endMonth > 12) errors.push('End month must be 1-12');
      if (data.startYear < 2020) errors.push('Start year must be valid');
      if (data.endYear < 2020) errors.push('End year must be valid');

      const start = data.startYear * 12 + data.startMonth;
      const end = data.endYear * 12 + data.endMonth;
      if (start > end) errors.push('Start month must not be after end month');
    }

    return errors;
  }
}
