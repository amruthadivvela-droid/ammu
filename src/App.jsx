import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicPortfolio from './routes/PublicPortfolio';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import './styles.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('amrutha-theme') || 'sakura';
    } catch {
      return 'sakura';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('amrutha-theme', theme);
    } catch {}
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicPortfolio
            currentTheme={theme}
            onThemeChange={handleThemeChange}
          />
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
