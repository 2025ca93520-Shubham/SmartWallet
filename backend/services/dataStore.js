import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

class DataStore {
  constructor() {
    this.data = {
      transactions: [],
      budgets: [],
      categories: [],
    };
  }

  async loadData() {
    try {
      const [transactions, budgets, categories] = await Promise.all([
        this.loadFile('transactions.json'),
        this.loadFile('budgets.json'),
        this.loadFile('categories.json'),
      ]);

      this.data = { transactions, budgets, categories };
      console.log('Data loaded successfully from JSON files');
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = { transactions: [], budgets: [], categories: [] };
    }
  }

  async loadFile(filename) {
    try {
      const filePath = path.join(dataDir, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  async saveFile(filename, data) {
    try {
      const filePath = path.join(dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
      throw new Error(`Failed to save ${filename}`);
    }
  }

  async save() {
    await Promise.all([
      this.saveFile('transactions.json', this.data.transactions),
      this.saveFile('budgets.json', this.data.budgets),
      this.saveFile('categories.json', this.data.categories),
    ]);
  }
}

export const dataStore = new DataStore();
