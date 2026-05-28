import { v4 as uuidv4 } from 'uuid';
import { Category } from '../models/Category.js';
import { dataStore } from './dataStore.js';

export class CategoryService {
  getAll() {
    return dataStore.data.categories;
  }

  getById(id) {
    return dataStore.data.categories.find((c) => c.id === id);
  }

  create(data) {
    const errors = Category.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const category = new Category(uuidv4(), data.name, data.icon, data.color);

    dataStore.data.categories.push(category);
    return category;
  }

  update(id, data) {
    const index = dataStore.data.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    const errors = Category.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    dataStore.data.categories[index] = {
      id,
      name: data.name,
      icon: data.icon || '💰',
      color: data.color || '#6366f1',
    };

    return dataStore.data.categories[index];
  }

  delete(id) {
    const index = dataStore.data.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    return dataStore.data.categories.splice(index, 1)[0];
  }
}

export const categoryService = new CategoryService();
