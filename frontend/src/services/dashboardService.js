import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:3000' : '');

export async function fetchDashboardSummary(params = {}) {
  const response = await axios.get(`${API_BASE_URL}/api/dashboard/summary`, { params });
  return response.data?.data ?? response.data;
}

export async function fetchMonthlyTrends() {
  const response = await axios.get(`${API_BASE_URL}/api/dashboard/trends`);
  return response.data?.data ?? response.data;
}
