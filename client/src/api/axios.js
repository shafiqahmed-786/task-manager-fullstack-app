// client/src/api/axios.js
// Shared Axios instance with JWT injection and 401 auto-logout

import axios from 'axios';

const STORAGE_KEY = 'tm_user';

const api = axios.create({
  // In dev, Vite proxies /api → http://localhost:5000
  // In production, set VITE_API_URL to your deployed backend URL
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ─── Request Interceptor: attach Bearer token on every request ────────────────
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: auto-logout on 401 ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
