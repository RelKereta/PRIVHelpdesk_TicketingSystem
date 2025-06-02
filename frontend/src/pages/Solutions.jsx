import React, { useState, useEffect } from 'react';
import { solutionService } from '../services/api';
import './Solutions.css';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await solutionService.getSolutions();
      setSolutions(response);
    } catch (err) {
      setError('Failed to fetch solutions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading solutions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="solutions-container">
      <h1>Knowledge Base Solutions</h1>
      {isAdmin && (
        <button className="add-solution-btn">Add New Solution</button>
      )}
      <div className="solutions-grid">
        {solutions.map(solution => (
          <div key={solution._id} className="solution-card">
            <h3>{solution.title}</h3>
            <p>{solution.description}</p>
            <div className="solution-meta">
              <span className="category">{solution.category}</span>
              <span className="views">{solution.views} views</span>
            </div>
            {isAdmin && (
              <div className="solution-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solutions;
