import React, { useState, useEffect } from 'react';
import { candidateAPI, voteAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CandidateCard from './CandidateCard';
import CountdownTimer from './CountdownTimer';
import Modal from './Modal';

const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    loadCandidates();
    loadUserVotes();
  }, []);

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

  const loadUserVotes = async () => {
    try {
      const response = await voteAPI.getAll();
      setUserVotes(response.data);
    } catch (error) {
      console.error('Failed to load votes:', error);
    }
  };

  const handleVote = async (candidateId) => {
    try {
      setVotingLoading(true);
      setError('');
      
      await voteAPI.vote(candidateId);
      await loadUserVotes();
      
      const candidate = candidates.find(c => c.id === candidateId);
      setSelectedCandidate(candidate);
      setShowSuccessModal(true);
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to submit vote';
      setError(message);
    } finally {
      setVotingLoading(false);
    }
  };

  const userVote = userVotes.find(vote => vote.userId === user?.id);
  const hasVoted = !!userVote;
  const votedFor = userVote?.candidateId;

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  return (
    <div className="container">
      <div className="voting-header">
        <h1 className="voting-title">Gunakan Hak Pilih Anda!</h1>
        <p className="voting-subtitle">
          {hasVoted
            ? 'Terima kasih telah berpartisipasi dalam Pilpres 2045!'
            : 'Pilih pemimpin masa depan Indonesia. Suara Anda sangat berarti!'}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="cards-grid">
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onVote={handleVote}
            hasVoted={hasVoted}
            votedFor={votedFor}
            loading={votingLoading}
            isAdmin={false}
          />
        ))}
      </div>

      {candidates.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', marginTop: '3rem' }}>
          Belum ada kandidat yang tersedia. Mohon tunggu informasi dari Admin.
        </div>
      )}

      <div id="countdown-container">
          <CountdownTimer targetDate="2025-07-01T12:00:00" />
      </div>

      <Modal
        isOpen={showSuccessModal}
        type="success"
        title="Terima Kasih!"
        message={`Suara Anda untuk ${selectedCandidate?.name} telah berhasil dicatat. Anda telah berpartisipasi dalam Pemilu 2024.`}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};
export default VotingPage;