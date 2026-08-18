import { useEffect, useState } from 'react';
import BudgetForm from '../components/BudgetForm';
import { fetchCategories } from '../services/categoryService';
import { fetchBudgets, createBudget, updateBudget } from '../services/budgetService';
import './pages.css';

export default function BudgetsPage() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setError('');
    try {
      const [cats, budgetData] = await Promise.all([fetchCategories(), fetchBudgets()]);
      setCategories(cats); setBudgets(budgetData);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load budgets.');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function save(data) {
    try {
      const result = data.id ? await updateBudget(data.id, data) : await createBudget(data);
      setBudgets((current) => data.id ? current.map((item) => item.id === result.id ? result : item) : [...current, result]);
      setEditing(null); setError('');
    } catch (err) { setError(err?.response?.data?.message || 'Unable to save budget.'); }
  }

  return (
    <section>
      <div className="page-header">
        <div><h2>Budgets</h2></div>
        <button className="button secondary" onClick={load} disabled={loading}>↻ Refresh</button>
      </div>
      {error && <div className="alert error" role="alert">{error}</div>}
      {loading ? <div className="state card"><div className="spinner" />Loading budgets...</div> : (
        <div className="two-column">
          <div className="card panel"><BudgetForm categories={categories} budget={editing} onSubmit={save} onCancel={() => setEditing(null)} /></div>
          <div className="card panel">
            <h3>Existing budgets</h3>
            {budgets.length === 0 ? <p className="muted">No budgets found.</p> : budgets.map((item) => (
              <div className="budget-row" key={item.id}>
                <div><strong>{item.category}</strong><small>{item.month}/{item.year}</small></div>
                <strong>₹{Number(item.limit).toLocaleString('en-IN')}</strong>
                <button className="button small" onClick={() => setEditing(item)}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
