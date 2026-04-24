// client/src/App.jsx
// Root component: sets up React Router and wraps app in AuthProvider

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// ─── Spinner shown during initial auth state resolution ───────────────────────
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Protected Route: redirects to /login if user is not authenticated ────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

// ─── Public Route: redirects to /dashboard if user is already logged in ──────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// ─── Route Definitions ────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />

    <Route
      path="/signup"
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Catch-all redirect */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// AuthProvider is inside BrowserRouter so hooks can access router context
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
