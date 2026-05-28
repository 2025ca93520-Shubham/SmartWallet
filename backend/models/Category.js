export class Category {
  constructor(id, name, icon = '💰', color = '#6366f1') {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
  }

  static validate(data) {
    const errors = [];
    if (!data.name) errors.push('Category name is required');
    return errors;
  }
}
