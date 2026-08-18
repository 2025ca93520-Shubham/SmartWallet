import { useState } from 'react';
import { addFundsToSavingsGoal } from '../services/savingsGoalService';

export default function SavingsGoalCard({ goal, onFundsAdded }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setError('Enter a positive amount');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const updatedGoal = await addFundsToSavingsGoal(goal.id, Number(amount));
      onFundsAdded?.(updatedGoal);
      setAmount('');
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to add funds right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        borderRadius: '0.75rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        padding: '1rem',
        display: 'grid',
        gap: '0.75rem',
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: '#0f172a' }}>{goal.name}</div>
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {goal.currentAmount} / {goal.targetAmount}
        </div>
      </div>

      <div style={{ height: '0.5rem', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: '#1e3a8a' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-label={`Add funds to ${goal.name}`}
          style={{
            flex: 1,
            padding: '0.6rem 0.8rem',
            borderRadius: '0.75rem',
            border: '1px solid #d8e1f1',
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: '#1e3a8a',
            color: '#fff',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          Add funds
        </button>
      </form>

      {error && (
        <p role="alert" style={{ margin: 0, color: '#b91c1c', fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  );
}
