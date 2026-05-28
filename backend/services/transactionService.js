import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../models/Transaction.js';
import { dataStore } from './dataStore.js';

export class TransactionService {
  getAll() {
    return dataStore.data.transactions;
  }

  getById(id) {
    return dataStore.data.transactions.find((t) => t.id === id);
  }

  create(data) {
    const errors = Transaction.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const transaction = new Transaction(
      uuidv4(),
      data.amount,
      data.category,
      data.description,
      data.date,
      data.type || 'expense'
    );

    dataStore.data.transactions.push(transaction);
    return transaction;
  }

  update(id, data) {
    const index = dataStore.data.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      throw error;
    }

    const errors = Transaction.validate(data);
    if (errors.length > 0) {
      const error = new Error(errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    dataStore.data.transactions[index] = {
      id,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
      type: data.type || 'expense',
    };

    return dataStore.data.transactions[index];
  }

  delete(id) {
    const index = dataStore.data.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      const error = new Error('Transaction not found');
      error.statusCode = 404;
      throw error;
    }

    return dataStore.data.transactions.splice(index, 1)[0];
  }
}

export const transactionService = new TransactionService();
