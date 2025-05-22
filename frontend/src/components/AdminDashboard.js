import React, { useState, useEffect } from 'react';
import { candidateAPI, voteAPI } from '../services/api';
import CandidateCard from './CandidateCard';

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
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingCandidate) {
        await candidateAPI.update(editingCandidate.id, formDataToSend);
        setSuccess('Candidate updated successfully');
      } else {
        await candidateAPI.create(formDataToSend);
        setSuccess('Candidate added successfully');
      }

      setShowModal(false);
      loadCandidates();
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to save candidate');
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
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Kelola kandidat dan pantau hasil voting</p>
      </div>

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

      {/* Voting Results */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Hasil Voting Real-time</h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Total Suara: <strong>{getTotalVotes()}</strong>
        </p>
        
        {getVoteResults().map(candidate => (
          <div key={candidate.id} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{candidate.name}</span>
              <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                {candidate.voteCount} suara ({candidate.percentage}%)
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '10px', 
              background: '#e9ecef', 
              borderRadius: '5px', 
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${candidate.percentage}%`, 
                height: '100%', 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-actions">
        <h2>Manage Candidates</h2>
        <button 
          onClick={handleAddCandidate}
          className="btn btn-primary btn-small"
        >
          Add New Candidate
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

      {candidates.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginTop: '3rem' }}>
          Belum ada kandidat. Tambahkan kandidat pertama!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Candidate Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Candidate Image</label>
                <input
                  type="file"
                  id="image"
                  className="file-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="image" className="file-input-label">
                  {formData.image ? formData.image.name : 'Choose Image'}
                </label>
                
                {imagePreview && (
                  <div className="file-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '50%' }}
                >
                  {editingCandidate ? 'Update' : 'Add'} Candidate
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  style={{ width: '50%' }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;