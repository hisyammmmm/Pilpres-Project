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
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Pemilihan Umum Presiden 2024
        </Link>

        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <span className="navbar-welcome">Halo, {user.name}</span>
              <ul className="navbar-nav">
                <li><Link to="/voting">Voting</Link></li>
                {isAdmin && <li><Link to="/admin">Admin</Link></li>}
              </ul>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
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
