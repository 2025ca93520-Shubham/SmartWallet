import { useEffect, useState } from 'react';
import CategoryDropdown from './CategoryDropdown';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function resolveCategoryId(categoryNameOrId, categories) {
  const match = categories.find(
    (category) => category.id === categoryNameOrId || category.name === categoryNameOrId,
  );
  return match?.id ?? categoryNameOrId ?? '';
}

function toFormState(budget, categories) {
  return {
    category: resolveCategoryId(budget?.category, categories),
    limit: budget?.limit ?? '',
    month: budget?.month ?? new Date().getMonth() + 1,
    year: budget?.year ?? new Date().getFullYear(),
  };
}

export default function BudgetForm({ categories = [], budget = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormState(budget, categories));
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(toFormState(budget, categories));
    setError('');
  }, [budget, categories]);

  const isEditing = Boolean(budget?.id);

  const handleFieldChange = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.category) {
      setError('Category is required');
      return;
    }
    if (!form.limit || Number(form.limit) <= 0) {
      setError('Limit must be positive');
      return;
    }

    setError('');
    const matchedCategory = categories.find((category) => category.id === form.category);
    onSubmit?.({
      ...(isEditing ? { id: budget.id } : {}),
      category: matchedCategory?.name ?? form.category,
      limit: Number(form.limit),
      month: Number(form.month),
      year: Number(form.year),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
      <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>
        {isEditing ? 'Edit budget' : 'Set a monthly budget'}
      </h2>

      <CategoryDropdown
        label="Category"
        categories={categories}
        value={form.category}
        onChange={handleFieldChange('category')}
      />

      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span>Limit</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.limit}
          onChange={(event) => handleFieldChange('limit')(event.target.value)}
          aria-label="Limit"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #d8e1f1',
            fontSize: '1rem',
          }}
        />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Month</span>
          <select
            value={form.month}
            onChange={(event) => handleFieldChange('month')(event.target.value)}
            aria-label="Month"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid #d8e1f1',
              fontSize: '1rem',
            }}
          >
            {MONTHS.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Year</span>
          <input
            type="number"
            value={form.year}
            onChange={(event) => handleFieldChange('year')(event.target.value)}
            aria-label="Year"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid #d8e1f1',
              fontSize: '1rem',
            }}
          />
        </label>
      </div>

      {error && (
        <p role="alert" style={{ margin: 0, color: '#b91c1c', fontWeight: 600 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: '#1e3a8a',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEditing ? 'Save changes' : 'Create budget'}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1px solid #d8e1f1',
              background: '#fff',
              color: '#1f2937',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
