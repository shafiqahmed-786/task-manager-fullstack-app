// client/src/api/auth.js
// Auth-specific API calls

import api from './axios';

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ _id, name, email, token }>}
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ _id, name, email, token }>}
 */
export const signupUser = async (userData) => {
  const { data } = await api.post('/auth/signup', userData);
  return data;
};

/**
 * Fetch the currently authenticated user's profile.
 * @returns {Promise<{ _id, name, email }>}
 */
export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
