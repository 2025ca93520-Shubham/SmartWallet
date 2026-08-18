import { describe, expect, it } from 'vitest';
import { normalizeBudgets } from './budgetService';

describe('normalizeBudgets', () => {
  it('returns direct arrays when provided', () => {
    const budgets = [{ id: 'bud-1', category: 'Food & Dining', limit: 500 }];
    expect(normalizeBudgets(budgets)).toEqual(budgets);
  });

  it('unwraps response payloads from API data', () => {
    const payload = { data: [{ id: 'bud-2', category: 'Utilities', limit: 200 }] };
    expect(normalizeBudgets(payload)).toEqual(payload.data);
  });

  it('returns an empty array for unrecognized payloads', () => {
    expect(normalizeBudgets(null)).toEqual([]);
    expect(normalizeBudgets({})).toEqual([]);
  });
});
