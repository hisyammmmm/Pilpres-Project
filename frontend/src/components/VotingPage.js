import React, { useState, useEffect } from 'react';
import { candidateAPI, voteAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CandidateCard from './CandidateCard';

const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      // Reload votes to update UI
      await loadUserVotes();
      
      alert('Vote submitted successfully!');
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to submit vote';
      setError(message);
      alert(message);
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
        <h1 className="voting-title">Pilihan Presiden 2024</h1>
        <p className="voting-subtitle">
          {hasVoted 
            ? 'Terima kasih telah memberikan suara Anda!' 
            : 'Silakan pilih kandidat pilihan Anda'
          }
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

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
          Belum ada kandidat yang tersedia
        </div>
      )}
    </div>
  );
};
export default VotingPage;