
import { useCallback, useEffect, useMemo, useState } from 'react';
import CategoryDropdown from './components/CategoryDropdown';
import BudgetForm from './components/BudgetForm';
import SavingsGoalCard from './components/SavingsGoalCard';
import { fetchCategories } from './services/categoryService';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from './services/budgetService';
import { fetchSavingsGoals } from './services/savingsGoalService';
import { fetchExpenses, createExpense, deleteExpense } from './services/expenseService';

const money = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v) || 0);
const today = () => new Date().toISOString().slice(0, 10);

function Icon({ name }) {
  const p = {
    wallet: <><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H20a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 17.5z"/><path d="M3 8h15.5A2.5 2.5 0 0 1 21 10.5V14h-4.5a2.5 2.5 0 0 1 0-5H21"/><circle cx="16.5" cy="11.5" r=".5" fill="currentColor"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3-4 3 2 5-7"/></>,
    budget: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.7-4L3 10"/><path d="M3 5v5h5"/><path d="M4 13a8 8 0 0 0 14.7 4L21 14"/><path d="M21 19v-5h-5"/></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
}

const emptyExpense = { amount: '', category: '', description: '', date: today(), paymentMethod: 'debit', isRecurring: false, notes: '' };

export default function App() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [section, setSection] = useState('overview');
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseError, setExpenseError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [error, setError] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetError, setBudgetError] = useState('');

  const load = useCallback(async (quiet = false) => {
    quiet ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const results = await Promise.allSettled([
        fetchCategories(),
        fetchBudgets(),
        fetchSavingsGoals(),
        fetchExpenses(),
      ]);
      const [categoriesResult, budgetsResult, savingsGoalsResult, expensesResult] = results;
      const failures = results.filter((result) => result.status === 'rejected');

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
        setExpenseForm((current) => ({
          ...current,
          category: current.category || categoriesResult.value[0]?.name || '',
        }));
      }
      if (budgetsResult.status === 'fulfilled') setBudgets(budgetsResult.value);
      if (savingsGoalsResult.status === 'fulfilled') setSavingsGoals(savingsGoalsResult.value);
      if (expensesResult.status === 'fulfilled') setExpenses(expensesResult.value);

      if (failures.length === results.length) throw failures[0].reason;
      setLastRefreshed(new Date());
      if (failures.length > 0) {
        setError('Some SmartWallet data could not be refreshed. Please try again.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load SmartWallet data.');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0), [expenses]);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = useMemo(() => expenses.filter(e => String(e.date).slice(0, 7) === currentMonth).reduce((sum, e) => sum + Number(e.amount || 0), 0), [expenses]);
  const totalBudget = useMemo(() => budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0), [budgets]);
  const totalSaved = useMemo(() => savingsGoals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0), [savingsGoals]);

  async function addExpense(event) {
    event.preventDefault(); setExpenseError('');
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) return setExpenseError('Enter a positive amount.');
    if (!expenseForm.category || !expenseForm.description || !expenseForm.date) return setExpenseError('Category, description and date are required.');
    try {
      const created = await createExpense({ ...expenseForm, amount: Number(expenseForm.amount) });
      setExpenses(current => [created, ...current]);
      setExpenseForm({ ...emptyExpense, category: categories[0]?.name || '' });
      setShowExpenseForm(false);
      setSection('expenses');
    } catch (err) { setExpenseError(err.response?.data?.message || 'Unable to add expense.'); }
  }

  async function removeExpense(id) {
    if (!window.confirm('Delete this expense?')) return;
    try { await deleteExpense(id); setExpenses(current => current.filter(e => e.id !== id)); }
    catch (err) { setError(err.response?.data?.message || 'Unable to delete expense.'); }
  }

  async function saveBudget(data) {
    try {
      const result = data.id ? await updateBudget(data.id, data) : await createBudget(data);
      setBudgets(current => data.id ? current.map(x => x.id === result.id ? result : x) : [...current, result]);
      setEditingBudget(null); setBudgetError('');
    } catch (err) { setBudgetError(err.response?.data?.message || 'Unable to save budget.'); }
  }

  async function removeBudget(id) {
    if (!window.confirm('Delete this budget?')) return;
    try { await deleteBudget(id); setBudgets(current => current.filter(b => b.id !== id)); }
    catch (err) { setBudgetError(err.response?.data?.message || 'Unable to delete budget.'); }
  }

  function updateGoal(updated) {
    setSavingsGoals(current => current.map(g => g.id === updated.id ? updated : g));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">₹</div>
          <div>
            <strong>SmartWallet</strong>
            <span>Expense Tracker</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div><span className="eyebrow">SmartWallet</span><h1>{section === 'overview' ? 'Financial overview' : section === 'expenses' ? 'Expenses' : section === 'budgets' ? 'Budgets' : 'Savings goals'}</h1></div>
          <div className="actions">
            <button className="button secondary" onClick={() => load(true)} disabled={refreshing} aria-busy={refreshing}>
              {refreshing ? <span className="button-spinner" aria-hidden="true" /> : <Icon name="refresh" />}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="button primary" onClick={() => {setShowExpenseForm(true);setSection('expenses')}}><Icon name="plus"/> Add expense</button>
          </div>
        </header>

        <div className="refresh-status" role="status" aria-live="polite">
          {refreshing ? 'Updating your wallet data...' : lastRefreshed ? `Last refreshed at ${lastRefreshed.toLocaleTimeString()}` : ''}
        </div>

        {error && <div className="alert">{error}<button onClick={() => setError('')}>Dismiss</button></div>}

        {loading ? <div className="loading"><span className="spinner"/>Loading your wallet…</div> : (
          <>
            <section className="stats">
              <Stat label="Total expenses" value={money(totalExpenses)} hint={`${expenses.length} transactions`} />
              <Stat label="This month" value={money(monthlyExpenses)} hint="Current month spending" />
              <Stat label="Budget set" value={money(totalBudget)} hint={`${budgets.length} budgets`} />
              <Stat label="Saved" value={money(totalSaved)} hint={`${savingsGoals.length} goals`} />
            </section>

            {section === 'overview' && <Overview expenses={expenses} budgets={budgets} savingsGoals={savingsGoals} onExpense={() => {setSection('expenses');setShowExpenseForm(true)}} />}
            {section === 'expenses' && <Expenses expenses={expenses} onAdd={() => setShowExpenseForm(true)} onDelete={removeExpense} />}
            {section === 'budgets' && <Budgets categories={categories} budgets={budgets} editingBudget={editingBudget} setEditingBudget={setEditingBudget} onSave={saveBudget} onDelete={removeBudget} error={budgetError} />}
            {section === 'savings' && <div className="cards">{savingsGoals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} onFundsAdded={updateGoal}/>)}</div>}
          </>
        )}

        {showExpenseForm && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowExpenseForm(false)}>
          <form className="modal" onSubmit={addExpense}>
            <div className="modal-head"><div><span className="eyebrow">New transaction</span><h2>Add an expense</h2></div><button type="button" className="close" onClick={() => setShowExpenseForm(false)}>×</button></div>
            {expenseError && <div className="alert">{expenseError}</div>}
            <label>Amount (₹)<input autoFocus type="number" min="0.01" step="0.01" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm,amount:e.target.value})} /></label>
            <label>Description<input placeholder="e.g. Groceries" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm,description:e.target.value})} /></label>
            <div className="form-grid">
              <label>Category<select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm,category:e.target.value})}>{categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}</select></label>
              <label>Date<input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm,date:e.target.value})}/></label>
            </div>
            <div className="form-grid">
              <label>Payment method<select value={expenseForm.paymentMethod} onChange={e => setExpenseForm({...expenseForm,paymentMethod:e.target.value})}><option value="debit">Debit</option><option value="credit">Credit</option><option value="cash">Cash</option><option value="upi">UPI</option></select></label>
              <label className="check"><input type="checkbox" checked={expenseForm.isRecurring} onChange={e => setExpenseForm({...expenseForm,isRecurring:e.target.checked})}/> Recurring expense</label>
            </div>
            <label>Notes<textarea rows="3" placeholder="Optional note" value={expenseForm.notes} onChange={e => setExpenseForm({...expenseForm,notes:e.target.value})}/></label>
            <div className="modal-actions"><button type="button" className="button secondary" onClick={() => setShowExpenseForm(false)}>Cancel</button><button className="button primary" type="submit"><Icon name="plus"/> Save expense</button></div>
          </form>
        </div>}
      </main>
    </div>
  );
}

export default function App() {
  return <Layout />;
}