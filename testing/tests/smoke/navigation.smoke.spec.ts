import { expect, test } from '@playwright/test';
import { mockSmartWalletApi } from '../utils/apiMock.js';
import { openExpensesPage } from '../utils/testUtils.js';

test('main navigation works', async ({ page }) => {
  await mockSmartWalletApi(page);
  await page.goto('/');
  await openExpensesPage(page);
  await expect(page.getByRole('heading', { name: /expense list/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /budgets/i })).toBeVisible();
});
