import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardSummary, fetchMonthlyTrends } from '../services/dashboardService';
import './pages.css';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value) || 0);

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const summaryData = await fetchDashboardSummary();
      setSummary(summaryData);

      try {
        const trendData = await fetchMonthlyTrends();
        setTrends(Array.isArray(trendData) ? trendData : []);
      } catch (trendError) {
        setTrends([]);
        setError(trendError?.response?.data?.message || 'Monthly trends are temporarily unavailable.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load dashboard.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <section>
      <div className="page-header">
        <div><h2>Dashboard</h2></div>
        <button className="button secondary" onClick={load} disabled={loading}>↻ Refresh</button>
      </div>
      {error && <div className="alert error" role="alert">{error}<button onClick={load}>Retry</button></div>}
      {loading ? <div className="state card"><div className="spinner" />Loading dashboard...</div> : summary && (
        <>
          <div className="stats-grid">
            <Stat label="Total Income" value={money(summary.totalIncome)} />
            <Stat label="Total Expenses" value={money(summary.totalExpenses)} />
            <Stat label="Monthly Income" value={money(summary.monthlyIncome)} />
            <Stat label="Monthly Expenses" value={money(summary.monthlyExpenses)} />
            <Stat label="Total Budget" value={money(summary.totalBudget)} />
            <Stat label="Remaining Budget" value={money(summary.totalRemaining)} />
          </div>
          <div className="dashboard-grid">
            <div className="card panel">
              <h3>Budget usage</h3>
              <div className="progress-list">
                {(summary.budgetAnalysis || []).map((item) => (
                  <div key={item.category}>
                    <div className="progress-label"><span>{item.category}</span><strong>{item.percentageUsed}%</strong></div>
                    <div className="progress"><span style={{ width: `${Math.min(item.percentageUsed, 100)}%` }} /></div>
                    <small>{money(item.spent)} spent of {money(item.budget)}</small>
                  </div>
                ))}
                {!(summary.budgetAnalysis || []).length && <p className="muted">No active budgets for the current period.</p>}
              </div>
            </div>
            <div className="card panel">
              <h3>Monthly trends</h3>
              <div className="trend-list">
                {trends.slice(-6).map((item) => (
                  <div key={`${item.year}-${item.month}`} className="trend-row">
                    <span>{item.year}-{String(item.month).padStart(2, '0')}</span>
                    <span className="income">{money(item.income)}</span>
                    <span className="expense">{money(item.expenses)}</span>
                  </div>
                ))}
                {!trends.length && <p className="muted">No trend data available.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ label, value }) {
  return <div className="stat-card card"><span>{label}</span><strong>{value}</strong></div>;
}
