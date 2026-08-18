import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCategories } from '../services/categoryService';
import { fetchExpenses } from '../services/expenseService';
import './pages.css';

const money = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value || '—'
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [expenseData, categoryData] = await Promise.all([fetchExpenses(), fetchCategories()]);
      setExpenses(expenseData);
      setCategories(categoryData);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load expenses right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredExpenses = useMemo(() => {
    return [...expenses]
      .filter((expense) => category === 'all' || expense.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, category]);

  const total = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Expense List</h2>
          <p>View expenses sorted by latest date with category and amount.</p>
        </div>
        <button className="button secondary" onClick={load} disabled={loading}>↻ Refresh</button>
      </div>

      {error && <div className="alert error" role="alert">{error}<button onClick={load}>Retry</button></div>}

      <div className="toolbar card">
        <div>
          <strong>{filteredExpenses.length}</strong>
          <span> expense records</span>
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.name}>{item.icon ? `${item.icon} ` : ''}{item.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="state card"><div className="spinner" />Loading expenses...</div>
      ) : filteredExpenses.length === 0 ? (
        <div className="state card"><strong>No expenses found</strong><span>There are no records for the selected category.</span></div>
      ) : (
        <div className="card table-card">
          <div className="table-summary">
            <span>Total shown</span>
            <strong>{money(total)}</strong>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Expense</th><th>Category</th><th>Date</th><th>Payment</th><th>Recurring</th><th className="amount">Amount</th></tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td><strong>{expense.description}</strong>{expense.notes && <small>{expense.notes}</small>}</td>
                    <td><span className="pill">{expense.category}</span></td>
                    <td>{formatDate(expense.date)}</td>
                    <td>{expense.paymentMethod || '—'}</td>
                    <td>{expense.isRecurring ? 'Yes' : 'No'}</td>
                    <td className="amount"><strong>{money(expense.amount)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
