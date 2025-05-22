import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import VotingPage from './components/VotingPage';
import AdminDashboard from './components/AdminDashboard';
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
    <div className="container">
      <div style={{ 
        textAlign: 'center', 
        color: 'white', 
        padding: '5rem 0',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          🗳️ PILPRES 2024
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '3rem',
          opacity: 0.9
        }}>
          Sistem Pemilihan Presiden Digital
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <a href="/login" className="btn btn-primary" style={{ 
            textDecoration: 'none', 
            padding: '1rem 2rem',
            fontSize: '1.1rem'
          }}>
            Login
          </a>
          <a href="/register" className="btn btn-secondary" style={{ 
            textDecoration: 'none', 
            padding: '1rem 2rem',
            fontSize: '1.1rem'
          }}>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;