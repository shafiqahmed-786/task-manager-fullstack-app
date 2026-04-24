// client/src/context/AuthContext.jsx
// Global authentication state — provides user, login, signup, logout

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../api/auth';

const AuthContext = createContext(null);

// ─── Storage key constant (single source of truth) ───────────────────────────
const STORAGE_KEY = 'tm_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true during initial localStorage read

  // Restore session from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Corrupted data — clear it
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── login: call API, persist to localStorage, update state ────────────────
  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ─── signup: call API, persist to localStorage, update state ───────────────
  const signup = async (name, email, password) => {
    const data = await signupUser({ name, email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ─── logout: clear storage and reset state ──────────────────────────────────
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom hook for consuming auth context ───────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
