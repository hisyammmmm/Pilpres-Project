import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import VotingPage from './components/VotingPage';
import AdminDashboard from './components/AdminDashboard';
import RealCount from './components/RealCount';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/voting" replace />;
  }

  return children;
};

// Home Component
const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/voting" replace />;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          🗳️ PILPRES 2024
        </h1>
        <p className="home-subtitle">
          Sistem Pemilihan Presiden Digital
        </p>
        <div className="home-buttons">
          <a href="/login" className="btn btn-primary home-button">
            Login
          </a>
          <a href="/register" className="btn btn-secondary home-button">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/voting"
              element={
                <ProtectedRoute>
                  <VotingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/realcount"
              element={
                <ProtectedRoute>
                  <RealCount />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;