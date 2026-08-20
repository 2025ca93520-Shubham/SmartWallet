import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:3000' : '');

export function normalizeExpenses(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.expenses)) return payload.expenses;
  return [];
}

export async function fetchExpenses() {
  const response = await axios.get(`${API_BASE_URL}/api/expenses`);
  return normalizeExpenses(response.data);
}

export async function createExpense(expense) {
  const response = await axios.post(`${API_BASE_URL}/api/expenses`, expense);
  return response.data?.data ?? response.data;
}

export async function exportExpenses(category = 'all', dateRange = {}) {
  const response = await axios.get(`${API_BASE_URL}/api/expenses/export`, {
    params: { category },
    responseType: 'blob',
  });
  return response.data;
}

export async function exportExpenseReport(category = 'all') {
  const response = await axios.get(`${API_BASE_URL}/api/expenses/report`, {
    params: { category },
    responseType: 'blob',
  });
  return response.data;
}
