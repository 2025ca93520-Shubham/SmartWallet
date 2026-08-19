import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createExpense, fetchExpenses, normalizeExpenses } from './expenseService';

vi.mock('axios');

describe('expenseService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns normalized expense arrays', () => {
    const expenses = [{ id: 'exp-1', expenseName: 'Office Supplies' }];
    expect(normalizeExpenses(expenses)).toEqual(expenses);
    expect(normalizeExpenses({ data: expenses })).toEqual(expenses);
  });

  it('creates an expense through the API', async () => {
    axios.post.mockResolvedValue({ data: { data: { id: 'exp-1', expenseName: 'Office Supplies' } } });

    const payload = {
      expenseName: 'Office Supplies',
      amount: 1250,
      category: 'Office Supplies',
      date: '2026-08-19',
      paymentMethod: 'Credit Card',
    };

    await expect(createExpense(payload)).resolves.toEqual({ id: 'exp-1', expenseName: 'Office Supplies' });
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/expenses', payload);
  });

  it('fetches expenses from the API', async () => {
    axios.get.mockResolvedValue({ data: { data: [{ id: 'exp-2', expenseName: 'Travel' }] } });

    await expect(fetchExpenses()).resolves.toEqual([{ id: 'exp-2', expenseName: 'Travel' }]);
  });
});
