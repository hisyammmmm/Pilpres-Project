import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            🗳️ PILPRES 2024
          </Link>
          
          {isAuthenticated ? (
            <div className="navbar-user">
              <span>Welcome, {user.name}</span>
              <ul className="navbar-nav">
                <li><Link to="/voting">Voting</Link></li>
                {isAdmin && <li><Link to="/admin">Admin</Link></li>}
              </ul>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <ul className="navbar-nav">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;