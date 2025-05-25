import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiHome, FiCheckSquare, FiSettings, FiPieChart, FiActivity } from 'react-icons/fi';
import Modal from './Modal';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            E-Voting Pilpres 2045
          </Link>

          <div className="navbar-right">
            {isAuthenticated ? (
              <>
                <span className="navbar-welcome">Halo, {user.name}!</span>
                <ul className="navbar-nav">
                  <li><NavLink to="/voting"><FiCheckSquare />Voting</NavLink></li>
                  <li><NavLink to="/realcount"><FiActivity />Real Count</NavLink></li>
                  {isAdmin && (
                    <>
                      <li><NavLink to="/admin"><FiSettings />Admin</NavLink></li>
                    </>
                  )}
                  <li>
                    <button onClick={handleLogout} className="btn-logout">
                      <FiLogOut />Logout
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="navbar-nav">
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={showLogoutModal}
        type="warning"
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sistem?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default Navbar;