import { expenseService } from '../services/expenseService.js';
import { dataStore } from '../services/dataStore.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { expensesToCsv } from '../utils/csvFormatter.js';
import { dashboardService } from '../services/dashboardService.js';
import { createExpenseReportPdf } from '../utils/pdfReport.js';

const buildAllTimeSummary = (expenses, budgets, category) => {
  const filteredExpenses = category
    ? expenses.filter((expense) => expense.category === category)
    : expenses;
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const categoryBreakdown = filteredExpenses.reduce((breakdown, expense) => {
    const existing = breakdown.find((item) => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      breakdown.push({ category: expense.category, amount: expense.amount });
    }
    return breakdown;
  }, []);

  categoryBreakdown.forEach((item) => {
    item.amount = Math.round(item.amount * 100) / 100;
    item.percentage = totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0;
  });

  const filteredBudgets = category ? budgets.filter((budget) => budget.category === category) : budgets;
  const budgetAnalysis = filteredBudgets.map((budget) => {
    const spent = filteredExpenses
      .filter((expense) => expense.category === budget.category)
      .reduce((total, expense) => total + expense.amount, 0);
    return {
      category: budget.category,
      budget: budget.limit,
      spent: Math.round(spent * 100) / 100,
      remaining: Math.round((budget.limit - spent) * 100) / 100,
    };
  });
  const totalBudget = budgetAnalysis.reduce((total, item) => total + item.budget, 0);
  const totalSpent = budgetAnalysis.reduce((total, item) => total + item.spent, 0);

  return {
    period: { label: 'All available expenses' },
    expenses: filteredExpenses,
    monthlyExpenses: Math.round(totalExpenses * 100) / 100,
    categoryBreakdown,
    budgetAnalysis,
    totalBudget: Math.round(totalBudget * 100) / 100,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalRemaining: Math.round((totalBudget - totalSpent) * 100) / 100,
  };
};

const createBadRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

const parseDateRange = (query) => {
  const { from, to } = query;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const validateDate = (value, name) => {
    if (value === undefined) return null;
    if (!datePattern.test(value)) {
      throw createBadRequest(`${name} must be a valid date in YYYY-MM-DD format`);
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
      throw createBadRequest(`${name} must be a valid date in YYYY-MM-DD format`);
    }
    return value;
  };

  const fromDate = validateDate(from, 'From date');
  const toDate = validateDate(to, 'To date');
  if (fromDate && toDate && fromDate > toDate) {
    throw createBadRequest('From date must be on or before the to date');
  }
  return { from: fromDate, to: toDate };
};

const filterExpenses = (expenses, { category, from, to }) => expenses.filter((expense) => {
  const expenseDate = new Date(expense.date);
  const normalizedDate = Number.isNaN(expenseDate.getTime())
    ? ''
    : expenseDate.toISOString().slice(0, 10);
  return (!category || expense.category === category)
    && (!from || normalizedDate >= from)
    && (!to || normalizedDate <= to);
});

export const getAllExpenses = (req, res, next) => {
  try {
    const expenses = expenseService.getAll();
    successResponse(res, expenses);
  } catch (error) {
    next(error);
  }
};

export const exportExpenses = (req, res, next) => {
  try {
    const dateRange = parseDateRange(req.query);
    const expenses = expenseService.getAll();
    const category = req.query.category && req.query.category !== 'all' ? req.query.category : null;
    const filteredExpenses = filterExpenses(expenses, { category, ...dateRange });

    res.type('text/csv');
    res.attachment('expenses.csv');
    res.send(expensesToCsv(filteredExpenses));
  } catch (error) {
    next(error);
  }
};

export const exportExpenseReport = async (req, res, next) => {
  try {
    const dateRange = parseDateRange(req.query);
    const month = req.query.month ? parseInt(req.query.month, 10) : null;
    const year = req.query.year ? parseInt(req.query.year, 10) : null;
    const category = req.query.category && req.query.category !== 'all' ? req.query.category : null;
    const summary = dateRange.from || dateRange.to
      ? buildAllTimeSummary(
        filterExpenses(dataStore.data.expenses, { category, ...dateRange }),
        dataStore.data.budgets,
        null,
      )
      : month === null && year === null
        ? buildAllTimeSummary(dataStore.data.expenses, dataStore.data.budgets, category)
        : dashboardService.getSummary(month, year);

    if (dateRange.from || dateRange.to) {
      summary.period = { label: `${dateRange.from || 'Beginning'} to ${dateRange.to || 'End'}` };
    }

    if (month !== null || year !== null) {
      const targetMonth = month ?? new Date().getMonth() + 1;
      const targetYear = year ?? new Date().getFullYear();
      summary.expenses = dataStore.data.expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() + 1 === targetMonth
          && date.getFullYear() === targetYear
          && (!category || expense.category === category);
      });
    }

    if (category && month !== null && year !== null) {
      summary.categoryBreakdown = summary.categoryBreakdown.filter((item) => item.category === category);
      summary.budgetAnalysis = summary.budgetAnalysis.filter((item) => item.category === category);
      summary.monthlyExpenses = summary.categoryBreakdown.reduce((total, item) => total + item.amount, 0);
      summary.totalBudget = summary.budgetAnalysis.reduce((total, item) => total + item.budget, 0);
      summary.totalSpent = summary.budgetAnalysis.reduce((total, item) => total + item.spent, 0);
      summary.totalRemaining = summary.budgetAnalysis.reduce((total, item) => total + item.remaining, 0);
    }

    const pdf = await createExpenseReportPdf(summary);
    res.type('application/pdf');
    res.attachment('expense-report.pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = (req, res, next) => {
  try {
    const expense = expenseService.getById(req.params.id);
    if (!expense) {
      return errorResponse(res, 'Expense not found', 404);
    }
    successResponse(res, expense);
  } catch (error) {
    next(error);
  }
};

export const createExpense = (req, res, next) => {
  try {
    const expense = expenseService.create(req.body);
    dataStore.save();
    successResponse(res, expense, 201);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = (req, res, next) => {
  try {
    const expense = expenseService.update(req.params.id, req.body);
    dataStore.save();
    successResponse(res, expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = (req, res, next) => {
  try {
    const expense = expenseService.delete(req.params.id);
    dataStore.save();
    successResponse(res, expense);
  } catch (error) {
    next(error);
  }
};
