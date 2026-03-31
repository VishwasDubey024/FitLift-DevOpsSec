import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onStart={() => navigate('/signup')} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;