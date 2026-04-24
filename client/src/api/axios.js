// client/src/api/axios.js
// Shared Axios instance with JWT injection + 401 auto-logout (enhanced)

import axios from "axios";

const STORAGE_KEY = "tm_user";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

// ─── Request Interceptor: attach Bearer token ────────────────────────────────
API.interceptors.request.use(
  (config) => {
    try {
      // Support BOTH storage formats (robust)
      const stored = localStorage.getItem(STORAGE_KEY);
      const directToken = localStorage.getItem("token");

      let token = null;

      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.token;
      }

      if (!token && directToken) {
        token = directToken;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Token parse error:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: auto logout on 401 ────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all possible auth storage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("token");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;