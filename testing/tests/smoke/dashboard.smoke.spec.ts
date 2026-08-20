import { expect, test } from '@playwright/test';
import { mockSmartWalletApi } from '../utils/apiMock.js';

test('dashboard loads', async ({ page }) => {
  await mockSmartWalletApi(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /dashboard/i }).first()).toBeVisible();
  await expect(page.getByText(/total income/i)).toBeVisible();
  await expect(page.getByText(/monthly expenses/i)).toBeVisible();
});
