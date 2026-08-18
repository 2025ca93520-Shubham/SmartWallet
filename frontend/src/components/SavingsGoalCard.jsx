import { formatTargetDate } from '../utils/formatDate';

export default function SavingsGoalCard({ goal }) {
  const remainingAmount = goal.remainingAmount ?? Math.max(0, goal.targetAmount - goal.currentAmount);
  const progressPercentage =
    goal.progressPercentage ?? (goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0);

  return (
    <div
      style={{
        borderRadius: '0.75rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        padding: '1rem',
        display: 'grid',
        gap: '0.5rem',
      }}
    >
      <div style={{ fontWeight: 700, color: '#0f172a' }}>{goal.name}</div>

      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
        Target: {goal.targetAmount} &middot; Current: {goal.currentAmount} &middot; Remaining: {remainingAmount}
      </div>

      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Target date: {formatTargetDate(goal.targetDate)}</div>

      <div style={{ height: '0.5rem', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercentage}%`, height: '100%', background: '#1e3a8a' }} />
      </div>

      <div style={{ color: '#1e3a8a', fontWeight: 600, fontSize: '0.9rem' }}>{progressPercentage}% complete</div>
    </div>
  );
}
