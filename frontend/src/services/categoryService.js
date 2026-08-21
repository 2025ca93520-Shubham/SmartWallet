import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:3000' : '');

export function normalizeCategories(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.categories)) {
    return payload.categories;
  }

  return [];
}

export async function fetchCategories() {
  const response = await axios.get(`${API_BASE_URL}/api/categories`);
  return normalizeCategories(response.data);
}

export async function createCategory(category) {
  const response = await axios.post(`${API_BASE_URL}/api/categories`, category);
  return response.data?.data ?? response.data;
}
