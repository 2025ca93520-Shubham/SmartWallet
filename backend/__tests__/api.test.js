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
});
