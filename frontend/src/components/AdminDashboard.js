import React, { useState, useEffect } from 'react';
import { candidateAPI, voteAPI } from '../services/api';
import CandidateCard from './CandidateCard';
import Modal from './Modal';

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadCandidates(),
      loadVotes()
    ]);
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateAPI.getAll();
      setCandidates(response.data);
    } catch (error) {
      setError('Failed to load candidates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadVotes = async () => {
    try {
      const response = await voteAPI.getAll();
      setVotes(response.data);
    } catch (error) {
      console.error('Failed to load votes:', error);
    }
  };

  const handleAddCandidate = () => {
    setEditingCandidate(null);
    setFormData({ name: '', description: '', image: null });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      description: candidate.description,
      image: null
    });
    setImagePreview(candidate.image);
    setShowModal(true);
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      await candidateAPI.delete(id);
      setSuccess('Candidate deleted successfully');
      loadCandidates();
    } catch (error) {
      setError('Failed to delete candidate');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingCandidate) {
        await candidateAPI.update(editingCandidate.id, formDataToSend);
        setSuccessMessage('Kandidat berhasil diperbarui!');
      } else {
        await candidateAPI.create(formDataToSend);
        setSuccessMessage('Kandidat baru berhasil ditambahkan!');
      }

      setShowModal(false);
      setSuccessModal(true);
      loadCandidates();
    } catch (error) {
      setError(error.response?.data?.msg || 'Gagal menyimpan kandidat');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCandidateVoteCount = (candidateId) => {
    return votes.filter(vote => vote.candidateId === candidateId).length;
  };

  const getTotalVotes = () => {
    return votes.length;
  };

  const getVoteResults = () => {
    return candidates.map(candidate => ({
      ...candidate,
      voteCount: getCandidateVoteCount(candidate.id),
      percentage: getTotalVotes() > 0 ? 
        ((getCandidateVoteCount(candidate.id) / getTotalVotes()) * 100).toFixed(1) : 0
    })).sort((a, b) => b.voteCount - a.voteCount);
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
        <div className="container">
            <div className="admin-header">
                <h1 className="admin-title">Dashboard Admin Pilpres</h1>
                <p className="admin-subtitle">Kelola kandidat dan pantau hasil voting</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Voting Results */}
            <div className="card admin-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-white)' }}>Hasil Voting Real-time</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
                    Total Suara Masuk: <strong style={{ color: 'var(--accent-gold)', fontSize: '1.2em' }}>{getTotalVotes()}</strong>
                </p>

                {getVoteResults().map(candidate => (
                    <div key={candidate.id} className="vote-result-item">
                        <div className="vote-result-header">
                            <span className="vote-result-name">{candidate.name}</span>
                            <span className="vote-result-count">
                                {candidate.voteCount} suara ({candidate.percentage}%)
                            </span>
                        </div>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fg"
                                style={{ width: `${candidate.percentage}%` }}
                            >
                            </div>
                        </div>
                    </div>
                ))}
                 {getTotalVotes() === 0 && <p style={{textAlign: 'center', color: 'var(--text-light)'}}>Belum ada suara yang masuk.</p>}
            </div>

            <div className="admin-actions">
                <h2>Kelola Kandidat</h2>
                <button
                    onClick={handleAddCandidate}
                    className="btn btn-primary btn-small"
                >
                    + Tambah Kandidat Baru
                </button>
            </div>

            <div className="cards-grid">
                {candidates.map(candidate => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onEdit={handleEditCandidate}
                        onDelete={handleDeleteCandidate}
                        isAdmin={true}
                    />
                ))}
            </div>
             {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content modal-horizontal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingCandidate ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="horizontal-form">
                            <div className="form-layout">
                                <div className="form-image-section">
                                    <div className="image-upload-container">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="candidate-preview" />
                                        ) : (
                                            <div className="image-placeholder">
                                                <span>Upload Foto 3x4</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            className="file-input"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="image" className="file-input-button">
                                            {imagePreview ? 'Ganti Foto' : 'Upload Foto'}
                                        </label>
                                    </div>
                                </div>

                                {/* Right side - Form fields */}
                                <div className="form-fields-section">
                                    <div className="form-group">
                                        <label>Nama Kandidat</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Masukkan nama lengkap"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Deskripsi (Visi & Misi)</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Masukkan visi dan misi kandidat"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary">
                                            {editingCandidate ? 'Update' : 'Tambah'} Kandidat
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Modal
              isOpen={successModal}
              type="success"
              title="Berhasil!"
              message={successMessage}
              onClose={() => setSuccessModal(false)}
            />
        </div>
    );
};

export default AdminDashboard;