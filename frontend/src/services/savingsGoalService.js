import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:3000' : '');

export function normalizeSavingsGoals(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export async function fetchSavingsGoals() {
  const response = await axios.get(`${API_BASE_URL}/api/savings-goals`);
  return normalizeSavingsGoals(response.data);
}

export async function addFundsToSavingsGoal(id, amount) {
  const response = await axios.post(`${API_BASE_URL}/api/savings-goals/${id}/add-funds`, { amount });
  return response.data?.data ?? response.data;
}