import { useEffect, useMemo, useState } from 'react';
import CategoryDropdown from './CategoryDropdown';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer', 'Other'];

const initialState = {
  expenseName: '',
  amount: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: '',
};

function validateForm(form) {
  const errors = {};

  if (!form.expenseName.trim()) {
    errors.expenseName = 'Expense Name is required';
  }

  if (form.amount === '' || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
    errors.amount = 'Amount must be a valid positive number';
  }

  if (!form.category) {
    errors.category = 'Category is required';
  }

  if (!form.date || Number.isNaN(new Date(form.date).getTime())) {
    errors.date = 'Date must be valid';
  }

  if (!form.paymentMethod) {
    errors.paymentMethod = 'Payment Method is required';
  }

  return errors;
}

export default function ExpenseForm({ categories = [], onSubmit, isSubmitting = false }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const categoryOptions = useMemo(() => categories, [categories]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      category: current.category && categoryOptions.some((item) => item.id === current.category)
        ? current.category
        : current.category,
    }));
  }, [categoryOptions]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (submitAttempted) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const resetForm = () => {
    setForm(initialState);
    setErrors({});
    setSubmitAttempted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const selectedCategory = categories.find((item) => item.id === form.category);
    const payload = {
      expenseName: form.expenseName.trim(),
      amount: Number(form.amount),
      category: selectedCategory?.name || form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
    };

    try {
      await onSubmit?.(payload);
      resetForm();
    } catch (error) {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <p style={{ margin: 0, color: '#52607a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Expenses tab
        </p>
        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.2rem', color: '#111827' }}>Add Expense</h3>
      </div>

      <label style={{ display: 'grid', gap: '0.45rem' }}>
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Expense Name</span>
        <input
          type="text"
          value={form.expenseName}
          onChange={(event) => updateField('expenseName', event.target.value)}
          placeholder="Office Supplies"
          aria-label="Expense Name"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #d8e1f1',
            fontSize: '1rem',
          }}
          disabled={isSubmitting}
        />
        {errors.expenseName && <small role="alert" style={{ color: '#b91c1c' }}>{errors.expenseName}</small>}
      </label>

      <label style={{ display: 'grid', gap: '0.45rem' }}>
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Amount</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(event) => updateField('amount', event.target.value)}
          placeholder="1250"
          aria-label="Amount"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #d8e1f1',
            fontSize: '1rem',
          }}
          disabled={isSubmitting}
        />
        {errors.amount && <small role="alert" style={{ color: '#b91c1c' }}>{errors.amount}</small>}
      </label>

      <CategoryDropdown
        label="Category"
        categories={categories}
        value={form.category}
        onChange={(value) => updateField('category', value)}
        placeholder="Select a category"
      />
      {errors.category && <small role="alert" style={{ color: '#b91c1c', marginTop: '-0.5rem' }}>{errors.category}</small>}

      <label style={{ display: 'grid', gap: '0.45rem' }}>
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Date</span>
        <input
          type="date"
          value={form.date}
          onChange={(event) => updateField('date', event.target.value)}
          aria-label="Date"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #d8e1f1',
            fontSize: '1rem',
          }}
          disabled={isSubmitting}
        />
        {errors.date && <small role="alert" style={{ color: '#b91c1c' }}>{errors.date}</small>}
      </label>

      <label style={{ display: 'grid', gap: '0.45rem' }}>
        <span style={{ fontWeight: 600, color: '#1f2937' }}>Payment Method</span>
        <select
          value={form.paymentMethod}
          onChange={(event) => updateField('paymentMethod', event.target.value)}
          aria-label="Payment Method"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #d8e1f1',
            fontSize: '1rem',
            background: '#fff',
          }}
          disabled={isSubmitting}
        >
          <option value="">Select a payment method</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        {errors.paymentMethod && <small role="alert" style={{ color: '#b91c1c' }}>{errors.paymentMethod}</small>}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: 'fit-content',
          padding: '0.8rem 1.2rem',
          borderRadius: '0.8rem',
          border: 'none',
          background: '#302898',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
      </button>
    </form>
  );
}
