import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Gunakan NavLink
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal'; // Pastikan untuk mengimpor komponen Modal

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
            E-Voting Pilpres 2028
          </Link>

          <div className="navbar-right">
            {isAuthenticated ? (
              <>
                <span className="navbar-welcome">Halo, {user.name}!</span>
                <ul className="navbar-nav">
                  <li><NavLink to="/voting" activeClassName="active">Voting</NavLink></li>
                  {isAdmin && <li><NavLink to="/admin" activeClassName="active">Admin</NavLink></li>}
                </ul>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <ul className="navbar-nav">
                <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
                <li><NavLink to="/register" activeClassName="active">Register</NavLink></li>
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