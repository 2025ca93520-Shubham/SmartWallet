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
    const normalizedData = {
      ...data,
      expenseName: Expense.resolveExpenseName(data),
      amount: Number(data.amount),
      paymentMethod: (data.paymentMethod || '').toString().trim(),
      category: (data.category || '').toString().trim(),
      date: (data.date || '').toString().trim(),
    };

    const errors = Expense.validate(normalizedData);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const expense = new Expense(
      uuidv4(),
      normalizedData.expenseName,
      normalizedData.amount,
      normalizedData.category,
      normalizedData.date,
      normalizedData.paymentMethod
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

    const existingExpense = dataStore.data.expenses[index];
    const normalizedData = {
      ...data,
      expenseName: Expense.resolveExpenseName(data),
      amount: Number(data.amount),
      paymentMethod: (data.paymentMethod || '').toString().trim(),
      category: (data.category || '').toString().trim(),
      date: (data.date || '').toString().trim(),
    };

    const errors = Expense.validate(normalizedData);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    dataStore.data.expenses[index] = {
      id,
      expenseName: normalizedData.expenseName,
      description: normalizedData.expenseName,
      amount: normalizedData.amount,
      category: normalizedData.category,
      date: normalizedData.date,
      paymentMethod: normalizedData.paymentMethod,
      createdAt: existingExpense.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
