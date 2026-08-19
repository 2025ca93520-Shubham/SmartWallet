import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testingRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(testingRoot, '..');
const fixturePath = path.join(testingRoot, 'tests', 'fixtures', 'dataset.json');
const backendDataDir = path.join(repoRoot, 'backend', 'data');

const dataset = JSON.parse(await fs.readFile(fixturePath, 'utf-8'));

await Promise.all([
  fs.writeFile(path.join(backendDataDir, 'transactions.json'), JSON.stringify(dataset.transactions, null, 2)),
  fs.writeFile(path.join(backendDataDir, 'budgets.json'), JSON.stringify(dataset.budgets, null, 2)),
  fs.writeFile(path.join(backendDataDir, 'categories.json'), JSON.stringify(dataset.categories, null, 2)),
  fs.writeFile(path.join(backendDataDir, 'expenses.json'), JSON.stringify(dataset.expenses, null, 2)),
  fs.writeFile(path.join(backendDataDir, 'savingsGoals.json'), JSON.stringify(dataset.savingsGoals, null, 2)),
]);

console.log('Seeded backend data from testing/tests/fixtures/dataset.json');
