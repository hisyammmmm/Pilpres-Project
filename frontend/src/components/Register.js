import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }
    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setError('NIK harus terdiri dari 16 digit angka');
      setLoading(false);
      return;
    }

    const result = await register({
      nik: formData.nik,
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page-background">
      <div className="form-container">
        <h2 className="form-title">Registrasi Akun</h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nik">NIK (16 digit)</label>
            <input
              type="text"
              name="nik"
              id="nik"
              className="form-control"
              value={formData.nik}
              onChange={handleChange}
              maxLength="16"
              pattern="[0-9]{16}"
              title="NIK harus 16 digit angka"
              required
              placeholder="Masukkan NIK Anda"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Masukkan alamat email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Ulangi password Anda"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="text-link">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;