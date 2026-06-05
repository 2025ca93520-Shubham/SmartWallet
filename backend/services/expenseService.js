import { v4 as uuidv4 } from 'uuid';
import { Expense } from '../models/Expense.js';
import { dataStore } from './dataStore.js';

export class ExpenseService {
  getAll() {
    return dataStore.data.expenses;
  }

  getById(id) {
    return dataStore.data.expenses.find((e) => e.id === id);
  }

  create(data) {
    const errors = Expense.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const expense = new Expense(
      uuidv4(),
      data.amount,
      data.category,
      data.description,
      data.date,
      data.paymentMethod,
      data.isRecurring,
      data.notes,
    );

    dataStore.data.expenses.push(expense);
    return expense;
  }

  update(id, data) {
    const index = dataStore.data.expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      const error = new Error('Expense not found');
      error.statusCode = 404;
      throw error;
    }

    const errors = Expense.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    dataStore.data.expenses[index] = {
      id,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
      paymentMethod: data.paymentMethod,
      isRecurring: data.isRecurring,
      notes: data.notes,
    };

    return dataStore.data.expenses[index];
  }

  delete(id) {
    const index = dataStore.data.expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      const error = new Error('Expense not found');
      error.statusCode = 404;
      throw error;
    }

    return dataStore.data.expenses.splice(index, 1)[0];
  }
}

export const expenseService = new ExpenseService();
