import { describe, expect, it } from 'vitest';
import { normalizeCategories } from './categoryService';

describe('normalizeCategories', () => {
  it('returns direct arrays when provided', () => {
    const categories = [{ id: 'cat-1', name: 'Food & Dining' }];
    expect(normalizeCategories(categories)).toEqual(categories);
  });

  it('unwraps response payloads from API data', () => {
    const payload = { data: [{ id: 'cat-2', name: 'Utilities' }] };
    expect(normalizeCategories(payload)).toEqual(payload.data);
  });
});
