import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function normalizeBudgets(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.budgets)) {
    return payload.budgets;
  }

  return [];
}

export async function fetchBudgets() {
  const response = await axios.get(`${API_BASE_URL}/api/budgets`);
  return normalizeBudgets(response.data);
}

export async function createBudget(budget) {
  const response = await axios.post(`${API_BASE_URL}/api/budgets`, budget);
  return response.data?.data ?? response.data;
}

export async function updateBudget(id, budget) {
  const response = await axios.put(`${API_BASE_URL}/api/budgets/${id}`, budget);
  return response.data?.data ?? response.data;
}
