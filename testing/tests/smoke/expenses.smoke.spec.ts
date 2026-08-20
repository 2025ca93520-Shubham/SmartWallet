import { expect, test } from '@playwright/test';
import { testData } from '../fixtures/testData.js';
import { mockSmartWalletApi } from '../utils/apiMock.js';
import { ExpensesPage } from '../pages/ExpensesPage.js';

test('expenses page loads', async ({ page }) => {
  await mockSmartWalletApi(page);
  await page.goto('/expenses');
  await expect(page.getByRole('heading', { name: /expense list/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /add expense/i })).toBeVisible();
});

test('add expense form opens', async ({ page }) => {
  await mockSmartWalletApi(page);
  await page.goto('/expenses');
  await page.getByRole('button', { name: /add expense/i }).click();

  await expect(page.getByRole('heading', { name: /add expense/i })).toBeVisible();
  await expect(page.getByLabel('Expense Name')).toBeVisible();
  await expect(page.getByLabel('Amount')).toBeVisible();
  await expect(page.getByLabel('Category', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Date')).toBeVisible();
  await expect(page.getByLabel('Payment Method')).toBeVisible();
});

test('user can add an expense and see it displayed', async ({ page }) => {
  await mockSmartWalletApi(page);
  const expensesPage = new ExpensesPage(page);
  const uniqueExpenseName = `${testData.expenseNamePrefix} ${Date.now()}`;

  await page.goto('/expenses');
  await expensesPage.addExpense({
    expenseName: uniqueExpenseName,
    amount: testData.amount,
    date: testData.date,
    paymentMethod: testData.paymentMethod,
  });

  await expect(page.getByText(/added successfully/i)).toBeVisible();
  await expect(page.getByText(uniqueExpenseName, { exact: true })).toBeVisible();
});

test('critical API communication works for expenses', async ({ request }) => {
  const response = await request.get('/api/expenses');
  expect(response.ok()).toBeTruthy();
});
