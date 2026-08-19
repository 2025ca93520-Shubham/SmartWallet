import { expect, type Page } from '@playwright/test';

export async function waitForAppReady(page: Page) {
  await expect(page.locator('body')).toBeVisible();
}

export async function openExpensesPage(page: Page) {
  await page.getByRole('link', { name: /expenses/i }).click();
  await expect(page.getByRole('heading', { name: /expense list/i })).toBeVisible();
}

export async function getCategoryValue(page: Page) {
  const select = page.getByLabel('Category', { exact: true });
  const value = await select.evaluate((element) => {
    const options = Array.from((element as HTMLSelectElement).options);
    return options.find((option) => option.value)?.value ?? '';
  });

  return value;
}
