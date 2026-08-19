import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const buildExportParams = (category, dateRange) => ({
  category,
  ...(dateRange.from ? { from: dateRange.from } : {}),
  ...(dateRange.to ? { to: dateRange.to } : {}),
});

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

export async function exportExpenses(category = 'all', dateRange = {}) {
  const response = await axios.get(`${API_BASE_URL}/api/expenses/export`, {
    params: buildExportParams(category, dateRange),
    responseType: 'blob',
  });
  return response.data;
}

export async function exportExpenseReport(category = 'all', dateRange = {}) {
  const response = await axios.get(`${API_BASE_URL}/api/expenses/report`, {
    params: buildExportParams(category, dateRange),
    responseType: 'blob',
  });
  return response.data;
}
