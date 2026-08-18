import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import ExpensesPage from './pages/ExpensesPage';
import DashboardPage from './pages/DashboardPage';
import './styles/app.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '▦' },
  { path: '/expenses', label: 'Expenses', icon: '₹' },
  { path: '/categories', label: 'Categories', icon: '◫' },
  { path: '/budgets', label: 'Budgets', icon: '◒' },
];

function Layout() {
  const location = useLocation();
  const title = useMemo(() => {
    const item = navItems.find((nav) => location.pathname.startsWith(nav.path));
    return item?.label ?? 'SmartWallet';
  }, [location.pathname]);

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
          <div>
            <span className="eyebrow">SmartWallet</span>
            <h1>{title}</h1>
          </div>
          <div className="avatar">User</div>
        </header>

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