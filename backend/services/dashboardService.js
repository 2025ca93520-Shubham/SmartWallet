import { dataStore } from './dataStore.js';

export class DashboardService {
  getSummary(month, year) {
    const { expenses, transactions, budgets } = dataStore.data;

    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = expenses
      .reduce((sum, e) => sum + e.amount, 0);

    const monthlyExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === targetMonth && d.getFullYear() === targetYear;
    });

    const monthlyIncomeTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() + 1 === targetMonth && d.getFullYear() === targetYear && t.type === 'income';
    });

    const monthlyIncomeTotal = monthlyIncomeTransactions
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenseTotal = monthlyExpenses
      .reduce((sum, e) => sum + e.amount, 0);

    const activeBudgets = budgets.filter(
      (b) => b.month === targetMonth && b.year === targetYear
    );

    const budgetAnalysis = activeBudgets.map((b) => {
      const spent = monthlyExpenses
        .filter((e) => e.category === b.category)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        category: b.category,
        budget: b.limit,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round((b.limit - spent) * 100) / 100,
        percentageUsed: b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0,
      };
    });

    const totalBudget = activeBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgetAnalysis.reduce((sum, b) => sum + b.spent, 0);

    const categoryBreakdown = monthlyExpenses.reduce((acc, e) => {
      const existing = acc.find((c) => c.category === e.category);
      if (existing) {
        existing.amount = Math.round((existing.amount + e.amount) * 100) / 100;
      } else {
        acc.push({ category: e.category, amount: e.amount });
      }
      return acc;
    }, []);

    categoryBreakdown.forEach((c) => {
      c.percentage = monthlyExpenseTotal > 0
        ? Math.round((c.amount / monthlyExpenseTotal) * 100)
        : 0;
    });

    return {
      period: { month: targetMonth, year: targetYear },
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      monthlyIncome: Math.round(monthlyIncomeTotal * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenseTotal * 100) / 100,
      budgetAnalysis,
      totalBudget: Math.round(totalBudget * 100) / 100,
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalRemaining: Math.round((totalBudget - totalSpent) * 100) / 100,
      overallPercentageUsed: totalBudget > 0
        ? Math.round((totalSpent / totalBudget) * 100)
        : 0,
      categoryBreakdown,
    };
  }

  getMonthlyTrends() {
    const { expenses, transactions } = dataStore.data;

    const monthlyMap = {};

    const recordTransaction = (dateStr, amount, type) => {
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: d.getMonth() + 1, year: d.getFullYear(), income: 0, expenses: 0 };
      }
      if (type === 'income') {
        monthlyMap[key].income += amount;
      } else {
        monthlyMap[key].expenses += amount;
      }
    };

    expenses.forEach((e) => recordTransaction(e.date, e.amount, 'expense'));
    transactions.forEach((t) => recordTransaction(t.date, t.amount, t.type));

    return Object.values(monthlyMap)
      .map((m) => ({
        ...m,
        income: Math.round(m.income * 100) / 100,
        expenses: Math.round(m.expenses * 100) / 100,
      }))
      .sort((a, b) => a.year - b.year || a.month - b.month);
  }

  getCategoryComparison() {
    const { expenses, budgets } = dataStore.data;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
    });

    const activeBudgets = budgets.filter(
      (b) => b.month === currentMonth && b.year === currentYear
    );

    const uncategorizedExpenses = monthlyExpenses.filter(
      (e) => !activeBudgets.some((b) => b.category === e.category)
    );

    const uncategorizedTotal = uncategorizedExpenses
      .reduce((sum, e) => sum + e.amount, 0);

    return activeBudgets.map((b) => {
      const spent = monthlyExpenses
        .filter((e) => e.category === b.category)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        category: b.category,
        budget: b.limit,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round((b.limit - spent) * 100) / 100,
        percentageUsed: b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0,
        onTrack: spent <= b.limit,
      };
    });
  }
}

export const dashboardService = new DashboardService();
