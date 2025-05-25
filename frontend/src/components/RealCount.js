import React, { useState, useEffect } from 'react';
import { candidateAPI, voteAPI } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RealCount = () => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [candidatesRes, votesRes] = await Promise.all([
        candidateAPI.getAll(),
        voteAPI.getAll()
      ]);
      setCandidates(candidatesRes.data);
      setVotes(votesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const getCandidateVoteCount = (candidateId) => {
    return votes.filter(vote => vote.candidateId === candidateId).length;
  };

  const getTotalVotes = () => votes.length;

  const getVoteResults = () => {
    return candidates.map(candidate => ({
      ...candidate,
      voteCount: getCandidateVoteCount(candidate.id),
      percentage: getTotalVotes() > 0 ? 
        ((getCandidateVoteCount(candidate.id) / getTotalVotes()) * 100).toFixed(1) : 0
    })).sort((a, b) => b.voteCount - a.voteCount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const prepareChartData = () => {
    return getVoteResults().map(candidate => ({
      name: candidate.name,
      votes: candidate.voteCount,
      percentage: parseFloat(candidate.percentage)
    }));
  };

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  return (
    <div className="container">
      <div className="results-header">
        <h1 className="results-title">Hasil Pemilihan Presiden 2024</h1>
        <p className="results-subtitle">Real-time Vote Count & Statistics</p>
      </div>

      <div className="vote-summary">
        <div className="total-votes-card">
          <h2>Total Suara Masuk</h2>
          <div className="total-votes-count">{getTotalVotes()}</div>
          
          <div className="charts-container">
            <div className="chart-wrapper">
              <h3>Distribusi Suara</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepareChartData()}
                    dataKey="votes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({name, percentage}) => `${name} (${percentage}%)`}
                  >
                    {prepareChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper">
              <h3>Perbandingan Perolehan Suara</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" name="Jumlah Suara" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="candidates-circle-grid">
            {getVoteResults().map((candidate, index) => (
              <div key={candidate.id} className="candidate-circle-wrapper">
                <div className="candidate-circle-rank">#{index + 1}</div>
                <div className="candidate-circle-container">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name} 
                    className="candidate-circle-image"
                  />
                  <div className="vote-percentage-overlay">{candidate.percentage}%</div>
                </div>
                <div className="candidate-circle-info">
                  <h3>{candidate.name}</h3>
                  <div className="vote-count">{candidate.voteCount} suara</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealCount;