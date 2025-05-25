import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal'; // Import Modal component

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false); // New state for success message
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setShowLoginSuccess(true);
      setTimeout(() => {
        setShowLoginSuccess(false);
        navigate('/voting');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <>
      <div className="form-container fade-in">
        <h2 className="form-title">Login Pilpres 2024</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="text-link">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </div>
      </div>

      <Modal
        isOpen={showLoginSuccess}
        type="success"
        title="Login Berhasil!"
        message="Selamat datang di sistem e-Voting Pilpres 2024"
        onClose={() => setShowLoginSuccess(false)}
      />
    </>
  );
};

export default Login;