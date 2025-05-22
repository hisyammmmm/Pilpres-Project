import React from 'react';

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

  return (
    <div className="card fade-in">
      <img 
        src={candidate.image} 
        alt={candidate.name}
        className="candidate-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      
      <div className="candidate-name">
        {candidate.name}
      </div>
      
      <div className="candidate-description">
        {candidate.description}
      </div>
      
      {isAdmin ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => onEdit(candidate)}
            className="btn btn-secondary btn-small"
            style={{ width: '50%' }}
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(candidate.id)}
            className="btn btn-danger btn-small"
            style={{ width: '50%' }}
          >
            Delete
          </button>
        </div>
      ) : (
        <>
          {hasVoted ? (
            <div className="voted-badge">
              {isVotedCandidate ? '✓ You voted for this candidate' : 'You have voted'}
            </div>
          ) : (
            <button 
              onClick={() => onVote(candidate.id)}
              className="btn btn-success vote-button"
              disabled={loading}
            >
              {loading ? 'Voting...' : 'Vote'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CandidateCard;