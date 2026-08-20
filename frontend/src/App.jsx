
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
  const [error, setError] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetError, setBudgetError] = useState('');

  const load = useCallback(async (quiet = false) => {
    quiet ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const [c, b, s, e] = await Promise.all([fetchCategories(), fetchBudgets(), fetchSavingsGoals(), fetchExpenses()]);
      setCategories(c); setBudgets(b); setSavingsGoals(s); setExpenses(e);
      setExpenseForm((current) => ({ ...current, category: current.category || c[0]?.name || '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load SmartWallet data.');
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
          <div className="actions"><button className="button secondary" onClick={() => load(true)} disabled={refreshing}><Icon name="refresh"/> Refresh</button><button className="button primary" onClick={() => {setShowExpenseForm(true);setSection('expenses')}}><Icon name="plus"/> Add expense</button></div>
        </header>

        <div className="refresh-status" role="status" aria-live="polite">
          {refreshing ? 'Updating your wallet data...' : lastRefreshed ? `Last refreshed at ${lastRefreshed.toLocaleTimeString()}` : ''}
        </div>

        <main className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <Layout />;
}