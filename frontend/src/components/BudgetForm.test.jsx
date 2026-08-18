import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BudgetForm from './BudgetForm';

const categories = [{ id: 'cat-1', name: 'Food & Dining' }];

describe('BudgetForm', () => {
  it('renders create mode by default', () => {
    render(<BudgetForm categories={categories} />);
    expect(screen.getByText('Set a monthly budget')).toBeInTheDocument();
    expect(screen.getByText('Create budget')).toBeInTheDocument();
  });

  it('rejects submit without a category', () => {
    const onSubmit = vi.fn();
    render(<BudgetForm categories={categories} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Limit'), { target: { value: '300' } });
    fireEvent.click(screen.getByText('Create budget'));

    expect(screen.getByRole('alert')).toHaveTextContent('Category is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid new budget', () => {
    const onSubmit = vi.fn();
    render(<BudgetForm categories={categories} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByLabelText('Limit'), { target: { value: '300' } });
    fireEvent.click(screen.getByText('Create budget'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Food & Dining', limit: 300 }),
    );
  });

  it('prefills fields and submits an edit', () => {
    const onSubmit = vi.fn();
    const budget = { id: 'bud-1', category: 'cat-1', limit: 400, month: 5, year: 2025 };
    render(<BudgetForm categories={categories} budget={budget} onSubmit={onSubmit} />);

    expect(screen.getByText('Edit budget')).toBeInTheDocument();
    expect(screen.getByLabelText('Limit')).toHaveValue(400);

    fireEvent.change(screen.getByLabelText('Limit'), { target: { value: '450' } });
    fireEvent.click(screen.getByText('Save changes'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'bud-1', category: 'Food & Dining', limit: 450 }),
    );
  });

  it('prefills the category dropdown when the budget stores a category name (legacy data)', () => {
    const onSubmit = vi.fn();
    const budget = { id: 'bud-2', category: 'Food & Dining', limit: 550, month: 5, year: 2025 };
    render(<BudgetForm categories={categories} budget={budget} onSubmit={onSubmit} />);

    expect(screen.getByLabelText('Category')).toHaveValue('cat-1');

    fireEvent.click(screen.getByText('Save changes'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'bud-2', category: 'Food & Dining' }),
    );
  });
});
