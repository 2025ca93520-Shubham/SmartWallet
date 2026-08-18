import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from '../middleware/errorHandler.js';
import { requestLogger } from '../middleware/requestLogger.js';
import { serverConfig } from '../config/server.js';
import routes from '../routes/index.js';
import { dataStore } from '../services/dataStore.js';

const app = express();

app.use(cors(serverConfig.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

app.use('/api', routes);
app.use(errorHandler);

beforeAll(async () => {
  await dataStore.loadData();
});

describe('Backend API Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('Transactions API', () => {
    it('should get all transactions', async () => {
      const res = await request(app).get('/api/transactions');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get transaction by ID', async () => {
      const res = await request(app).get('/api/transactions/txn-1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('txn-1');
    });

    it('should create a new transaction', async () => {
      const newTransaction = {
        amount: 75.5,
        category: 'Food & Dining',
        description: 'Dinner',
        date: '2025-05-25',
        type: 'expense',
      };
      const res = await request(app).post('/api/transactions').send(newTransaction);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.amount).toBe(75.5);
    });

    it('should update a transaction', async () => {
      const updateData = {
        amount: 50,
        category: 'Food & Dining',
        description: 'Updated lunch',
        date: '2025-05-20',
        type: 'expense',
      };
      const res = await request(app).put('/api/transactions/txn-1').send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe('Updated lunch');
    });

    it('should delete a transaction', async () => {
      const res = await request(app).delete('/api/transactions/txn-5');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('txn-5');
    });

    it('should return 404 for non-existent transaction', async () => {
      const res = await request(app).get('/api/transactions/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('Budgets API', () => {
    it('should get all budgets', async () => {
      const res = await request(app).get('/api/budgets');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get budget by ID', async () => {
      const res = await request(app).get('/api/budgets/bud-1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('bud-1');
    });

    it('should create a new budget', async () => {
      const newBudget = {
        category: 'Healthcare',
        limit: 400,
        month: 5,
        year: 2025,
      };
      const res = await request(app).post('/api/budgets').send(newBudget);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.limit).toBe(400);
    });

    it('should update a budget', async () => {
      const updateData = {
        category: 'Food & Dining',
        limit: 550,
        month: 5,
        year: 2025,
      };
      const res = await request(app).put('/api/budgets/bud-1').send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.data.limit).toBe(550);
    });

    it('should delete a budget', async () => {
      const res = await request(app).delete('/api/budgets/bud-3');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('bud-3');
    });
  });

  describe('Categories API', () => {
    it('should get all categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get category by ID', async () => {
      const res = await request(app).get('/api/categories/cat-1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('cat-1');
    });

    it('should create a new category', async () => {
      const newCategory = {
        name: 'Gym',
        icon: '🏋️',
        color: '#ef4444',
      };
      const res = await request(app).post('/api/categories').send(newCategory);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('Gym');
    });

    it('should update a category', async () => {
      const updateData = {
        name: 'Updated Food',
        icon: '🍕',
        color: '#f97316',
      };
      const res = await request(app).put('/api/categories/cat-1').send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated Food');
    });

    it('should delete a category', async () => {
      const res = await request(app).delete('/api/categories/cat-8');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('cat-8');
    });
  });

  describe('Expenses API', () => {
    it('should get all expenses', async () => {
      const res = await request(app).get('/api/expenses');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get expense by ID', async () => {
      const res = await request(app).get('/api/expenses/exp-1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('exp-1');
    });

    it('should create a new expense', async () => {
      const newExpense = {
        amount: 120,
        category: 'Utilities',
        description: 'Electric bill',
        date: '2025-06-01',
        paymentMethod: 'credit',
        isRecurring: true,
        notes: 'Monthly',
      };
      const res = await request(app).post('/api/expenses').send(newExpense);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.amount).toBe(120);
      expect(res.body.data.paymentMethod).toBe('credit');
      expect(res.body.data.isRecurring).toBe(true);
    });

    it('should update an expense', async () => {
      const updateData = {
        amount: 90,
        category: 'Food & Dining',
        description: 'Updated grocery run',
        date: '2025-05-26',
        paymentMethod: 'debit',
        isRecurring: false,
        notes: 'Weekly',
      };
      const res = await request(app).put('/api/expenses/exp-1').send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.data.amount).toBe(90);
      expect(res.body.data.description).toBe('Updated grocery run');
    });

    it('should delete an expense', async () => {
      const res = await request(app).delete('/api/expenses/exp-2');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('exp-2');
    });

    it('should return 404 for non-existent expense', async () => {
      const res = await request(app).get('/api/expenses/nonexistent');
      expect(res.status).toBe(404);
    });

    it('should reject expense with negative amount', async () => {
      const newExpense = {
        amount: -10,
        category: 'Food',
        description: 'Test',
        date: '2025-06-01',
      };
      const res = await request(app).post('/api/expenses').send(newExpense);
      expect(res.status).toBe(400);
    });
  });

  describe('Dashboard API', () => {
    it('should return dashboard summary with default period', async () => {
      const res = await request(app).get('/api/dashboard/summary');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('period');
      expect(res.body.data).toHaveProperty('totalIncome');
      expect(res.body.data).toHaveProperty('totalExpenses');
      expect(res.body.data).toHaveProperty('monthlyIncome');
      expect(res.body.data).toHaveProperty('monthlyExpenses');
      expect(res.body.data).toHaveProperty('budgetAnalysis');
      expect(res.body.data).toHaveProperty('totalBudget');
      expect(res.body.data).toHaveProperty('totalSpent');
      expect(res.body.data).toHaveProperty('totalRemaining');
      expect(res.body.data).toHaveProperty('overallPercentageUsed');
      expect(res.body.data).toHaveProperty('categoryBreakdown');
    });

    it('should return dashboard summary for a specific month', async () => {
      const res = await request(app).get('/api/dashboard/summary?month=5&year=2025');
      expect(res.status).toBe(200);
      expect(res.body.data.period).toEqual({ month: 5, year: 2025 });
    });

    it('should return 400 for invalid month', async () => {
      const res = await request(app).get('/api/dashboard/summary?month=13&year=2025');
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid year', async () => {
      const res = await request(app).get('/api/dashboard/summary?month=5&year=2019');
      expect(res.status).toBe(400);
    });

    it('should include budget analysis with correct structure', async () => {
      const res = await request(app).get('/api/dashboard/summary?month=5&year=2025');
      expect(res.status).toBe(200);
      const analysis = res.body.data.budgetAnalysis;
      expect(Array.isArray(analysis)).toBe(true);
      if (analysis.length > 0) {
        const entry = analysis[0];
        expect(entry).toHaveProperty('category');
        expect(entry).toHaveProperty('budget');
        expect(entry).toHaveProperty('spent');
        expect(entry).toHaveProperty('remaining');
        expect(entry).toHaveProperty('percentageUsed');
      }
    });

    it('should include category breakdown with correct structure', async () => {
      const res = await request(app).get('/api/dashboard/summary?month=5&year=2025');
      expect(res.status).toBe(200);
      const breakdown = res.body.data.categoryBreakdown;
      expect(Array.isArray(breakdown)).toBe(true);
      if (breakdown.length > 0) {
        const entry = breakdown[0];
        expect(entry).toHaveProperty('category');
        expect(entry).toHaveProperty('amount');
        expect(entry).toHaveProperty('percentage');
      }
    });

    it('should return monthly trends', async () => {
      const res = await request(app).get('/api/dashboard/trends');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return category comparison', async () => {
      const res = await request(app).get('/api/dashboard/category-comparison');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Savings Goals API', () => {
    it('should get all savings goals', async () => {
      const res = await request(app).get('/api/savings-goals');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get savings goal by ID', async () => {
      const res = await request(app).get('/api/savings-goals/goal-1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('goal-1');
    });

    it('should return 404 for unknown savings goal', async () => {
      const res = await request(app).get('/api/savings-goals/unknown-goal');
      expect(res.status).toBe(404);
    });

    it('should add funds to a savings goal and update current amount', async () => {
      const before = await request(app).get('/api/savings-goals/goal-2');
      const startAmount = before.body.data.currentAmount;

      const res = await request(app).post('/api/savings-goals/goal-2/add-funds').send({ amount: 100 });
      expect(res.status).toBe(200);
      expect(res.body.data.currentAmount).toBe(startAmount + 100);
    });

    it('should return 400 when amount is missing', async () => {
      const res = await request(app).post('/api/savings-goals/goal-2/add-funds').send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 when amount is not positive', async () => {
      const res = await request(app).post('/api/savings-goals/goal-2/add-funds').send({ amount: -50 });
      expect(res.status).toBe(400);
    });

    it('should return 404 when adding funds to unknown savings goal', async () => {
      const res = await request(app).post('/api/savings-goals/unknown-goal/add-funds').send({ amount: 50 });
      expect(res.status).toBe(404);
    });

    it('should return 400 when amount would exceed the goal target', async () => {
      const goal = await request(app).get('/api/savings-goals/goal-2');
      const overAmount = goal.body.data.targetAmount - goal.body.data.currentAmount + 1;

      const res = await request(app)
        .post('/api/savings-goals/goal-2/add-funds')
        .send({ amount: overAmount });
      expect(res.status).toBe(400);
    });
  });
});
