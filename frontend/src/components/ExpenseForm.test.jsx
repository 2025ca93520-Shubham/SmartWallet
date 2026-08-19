import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ExpenseForm from './ExpenseForm';

const categories = [
  { id: 'cat-1', name: 'Office Supplies' },
  { id: 'cat-2', name: 'Travel' },
];

describe('ExpenseForm', () => {
  it('renders the add expense form', () => {
    render(<ExpenseForm categories={categories} onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Add Expense' })).toBeInTheDocument();
    expect(screen.getByLabelText('Expense Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Payment Method')).toBeInTheDocument();
  });

  it('shows validation messages for missing required fields', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm categories={categories} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    expect(await screen.findByText('Expense Name is required')).toBeInTheDocument();
    expect(screen.getByText('Amount must be a valid positive number')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Payment Method is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid expense payload and resets the form', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm categories={categories} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Expense Name'), { target: { value: 'Office Supplies' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '1250' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-08-19' } });
    fireEvent.change(screen.getByLabelText('Payment Method'), { target: { value: 'Credit Card' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      expenseName: 'Office Supplies',
      amount: 1250,
      category: 'Office Supplies',
      date: '2026-08-19',
      paymentMethod: 'Credit Card',
    });
    expect(screen.getByLabelText('Expense Name')).toHaveValue('');
    expect(screen.getByLabelText('Amount')).toHaveValue(null);
  });
});
