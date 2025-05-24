import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const CandidateCard = ({ 
  candidate, 
  onVote, 
  onEdit, 
  onDelete, 
  hasVoted, 
  votedFor, 
  isAdmin, 
  loading 
}) => {
  const isVotedCandidate = votedFor === candidate.id;
  const { user } = useAuth();

  return (
    <div className="candidate-card">
      <img 
        src={candidate.image} 
        alt={candidate.name}
        className="candidate-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      
      <div className="candidate-info">
        <h3 className="candidate-name">{candidate.name}</h3>
        <p className="candidate-description">{candidate.description}</p>
      </div>

      <div className="card-actions">
        {isAdmin ? (
          <div className="admin-buttons">
            <button onClick={() => onEdit(candidate)} className="btn-gold">Edit</button>
            <button onClick={() => onDelete(candidate.id)} className="btn-red">Delete</button>
          </div>
        ) : (
          <>
            {user && user.role === 'admin' ? (
              <div className="voted-badge">Admin tidak bisa voting</div>
            ) : hasVoted ? (
              <div className={`voted-badge ${isVotedCandidate ? 'voted-yes' : 'voted-other'}`}>
                {isVotedCandidate ? '✓ Kamu memilih kandidat ini' : 'Kamu sudah memilih'}
              </div>
            ) : (
              <button 
                onClick={() => {
                  const confirmed = window.confirm(`Apakah Anda yakin ingin memilih ${candidate.name}?`);
                  if (confirmed) {
                    onVote(candidate.id);
                  }
                }} 
                className="btn-vote"
                disabled={loading}
              >
                {loading ? 'Voting...' : 'Vote'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
