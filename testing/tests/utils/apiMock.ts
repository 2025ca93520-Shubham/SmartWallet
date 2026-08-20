import { expect, type Page } from '@playwright/test';
import dataset from '../fixtures/dataset.json' with { type: 'json' };

export async function mockSmartWalletApi(page: Page) {
  await page.route('**/api/categories', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'success', statusCode: 200, data: dataset.categories }),
    });
  });

  await page.route('**/api/budgets', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'success', statusCode: 200, data: dataset.budgets }),
    });
  });

  await page.route('**/api/expenses', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', statusCode: 200, data: dataset.expenses }),
      });
      return;
    }

    if (method === 'POST') {
      const body = await route.request().postDataJSON();
      const created = {
        id: 'exp-smoke-1',
        expenseName: body.expenseName,
        amount: body.amount,
        category: body.category,
        date: body.date,
        paymentMethod: body.paymentMethod,
      };

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', statusCode: 201, data: created }),
      });
      return;
    }

    await route.continue();
  });

  await page.route('**/api/dashboard/summary**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        statusCode: 200,
        data: {
          period: { month: 5, year: 2025 },
          totalIncome: 2500,
          totalExpenses: 195,
          monthlyIncome: 2500,
          monthlyExpenses: 195,
          budgetAnalysis: [
            {
              category: 'Food & Dining',
              budget: 550,
              spent: 75,
              remaining: 475,
              percentageUsed: 14,
            },
            {
              category: 'Entertainment',
              budget: 200,
              spent: 0,
              remaining: 200,
              percentageUsed: 0,
            },
          ],
          totalBudget: 750,
          totalSpent: 75,
          totalRemaining: 675,
          overallPercentageUsed: 10,
          categoryBreakdown: [
            { category: 'Food & Dining', amount: 75, percentage: 100 },
          ],
        },
      }),
    });
  });

  await page.route('**/api/dashboard/trends', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        statusCode: 200,
        data: [
          { month: 5, year: 2025, income: 2500, expenses: 75 },
          { month: 6, year: 2025, income: 0, expenses: 120 },
        ],
      }),
    });
  });
}

export function expectFixedDatasetVisible() {
  expect(dataset.categories.length).toBeGreaterThan(0);
}
