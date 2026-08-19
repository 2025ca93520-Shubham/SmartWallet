import { expect, type Page } from '@playwright/test';
import { getCategoryValue } from '../utils/testUtils.js';

export class ExpensesPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.getByRole('link', { name: /expenses/i }).click();
    await expect(this.page.getByRole('heading', { name: /expense list/i })).toBeVisible();
  }

  async openAddExpenseForm() {
    await this.page.getByRole('button', { name: /add expense/i }).click();
    await expect(this.page.getByRole('heading', { name: /add expense/i })).toBeVisible();
  }

  async addExpense(expense: {
    expenseName: string;
    amount: string;
    date: string;
    paymentMethod: string;
  }) {
    await this.page.getByRole('button', { name: /add expense/i }).click();
    await this.page.getByLabel('Expense Name').fill(expense.expenseName);
    await this.page.getByLabel('Amount').fill(expense.amount);
    await this.page.getByLabel('Date').fill(expense.date);
    await this.page.getByLabel('Payment Method').selectOption(expense.paymentMethod);

    const categoryValue = await getCategoryValue(this.page);
    if (!categoryValue) {
      throw new Error('No category option available for smoke test');
    }

    await this.page.getByLabel('Category', { exact: true }).selectOption(categoryValue);
    await this.page.getByRole('button', { name: /add expense/i }).click();
  }
}
