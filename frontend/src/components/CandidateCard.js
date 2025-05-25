import React from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa'; // Optional Icons

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
  const candidateNumber = candidate.number || '✔';

  return (
    <div className={`candidate-card ${isVotedCandidate ? 'voted-yes-card' : ''}`}>
       <div className="candidate-number-badge">{candidateNumber}</div>

      <img
        src={candidate.image}
        alt={candidate.name}
        className="candidate-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x250?text=Foto+Kandidat';
        }}
      />

      <div className="candidate-info">
        <h3 className="candidate-name">{candidate.name}</h3>
        <p className="candidate-description">{candidate.description}</p>
      </div>

      <div className="card-actions">
        {isAdmin ? (
          <div className="admin-buttons">
            <button onClick={() => onEdit(candidate)} className="btn btn-gold btn-small">
              {/* <FaEdit />  */}Edit
            </button>
            <button onClick={() => onDelete(candidate.id)} className="btn btn-red btn-small">
              {/* <FaTrash />  */}Delete
            </button>
          </div>
        ) : (
          <>
            {user && user.role === 'admin' ? (
              <div className="voted-badge voted-other">Admin tidak bisa voting</div>
            ) : hasVoted ? (
              <div className={`voted-badge ${isVotedCandidate ? 'voted-yes' : 'voted-other'}`}>
                {isVotedCandidate ? '✓ Pilihan Anda' : 'Anda Sudah Memilih'}
              </div>
            ) : (
              <button
                onClick={() => {
                  const confirmed = window.confirm(`Apakah Anda yakin ingin memilih ${candidate.name}?`);
                  if (confirmed) {
                    onVote(candidate.id);
                  }
                }}
                className="btn btn-vote"
                disabled={loading}
              >
                {loading ? 'Memilih...' : 'PILIH SEKARANG'}
              </button>
            )}
          </>
        )}
      </div>
       {/* CSS tambahan untuk nomor urut dan card terpilih */}
       <style jsx>{`
            .candidate-number-badge {
                position: absolute;
                top: 10px;
                left: 10px;
                background-color: var(--primary-red);
                color: white;
                font-weight: bold;
                font-size: 1.5rem;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.4);
                border: 2px solid white;
            }
            .voted-yes-card {
                border: 3px solid var(--accent-gold);
                box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
            }
        `}</style>
    </div>
  );
};

export default CandidateCard;