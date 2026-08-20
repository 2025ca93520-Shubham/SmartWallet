import { expect, test } from '@playwright/test';
import { waitForAppReady } from '../utils/testUtils.js';
import { mockSmartWalletApi } from '../utils/apiMock.js';

test('application is available', async ({ page }) => {
  await mockSmartWalletApi(page);
  await page.goto('/');
  await waitForAppReady(page);
  await expect(page).toHaveTitle(/smartwallet/i);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
