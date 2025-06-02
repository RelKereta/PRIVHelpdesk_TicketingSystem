import React, { useState, useEffect } from 'react';
import { solutionService } from '../services/api';
import './Solutions.css';

function Solutions() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isTechnician = () => user && (user.role === 'agent' || user.role === 'admin');
  const isAdmin = () => user && user.role === 'admin';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [newSolution, setNewSolution] = useState({
    title: '',
    category: '',
    description: '',
    content: ''
  });

  const categories = ['all', 'Account Management', 'Network', 'Software', 'Hardware', 'Other'];

  // Fetch solutions from database
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        const fetchedSolutions = await solutionService.getSolutions();
        setSolutions(fetchedSolutions);
        setError(null);
      } catch (error) {
        console.error('Error fetching solutions:', error);
        setError('Failed to load solutions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSolution = async (e) => {
    e.preventDefault();
    try {
      const createdSolution = await solutionService.createSolution(newSolution);
      setSolutions(prev => [createdSolution, ...prev]);
      setNewSolution({
        title: '',
        category: '',
        description: '',
        content: ''
      });
      setShowCreateModal(false);
      alert('Solution added to knowledge base successfully!');
    } catch (error) {
      console.error('Error creating solution:', error);
      alert('Failed to create solution. Please try again.');
    }
  };

  const handleViewSolution = async (solutionId) => {
    try {
      const fullSolution = await solutionService.getSolution(solutionId);
      setSelectedSolution(fullSolution);
      setShowViewModal(true);
      
      // Update the local state to reflect the view count increment
      setSolutions(prev => prev.map(sol => 
        sol._id === solutionId 
          ? { ...sol, views: sol.views + 1 }
          : sol
      ));
    } catch (error) {
      console.error('Error viewing solution:', error);
    }
  };

  if (loading) {
    return (
      <div className="solutions-page">
        <div className="loading-container">
          <h2>Loading solutions...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="solutions-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="solutions-page">
      <div className="solutions-header">
        <h1>Knowledge Base</h1>
        <p>Browse documented solutions and troubleshooting guides</p>
        {(isTechnician() || isAdmin()) && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="add-solution-btn"
          >
            📝 Add New Solution
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="solutions-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search solutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="solutions-grid">
        {filteredSolutions.map(solution => (
          <div key={solution._id} className="solution-card">
            <div className="solution-header">
              <h3>{solution.title}</h3>
              <span className="category-badge">{solution.category}</span>
            </div>
            
            <p className="solution-description">{solution.description}</p>
            
            <div className="solution-actions">
              <button 
                onClick={() => handleViewSolution(solution._id)}
                className="view-solution-btn"
              >
                📖 View Solution
              </button>
            </div>
            
            <div className="solution-footer">
              <div className="solution-meta">
                <span>Views: {solution.views || 0}</span>
                <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSolutions.length === 0 && (
        <div className="no-results">
          <h3>No solutions found</h3>
          <p>Try adjusting your search terms or category filter.</p>
        </div>
      )}

      {/* View Solution Modal */}
      {showViewModal && selectedSolution && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedSolution.title}</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="solution-detail">
              <div className="solution-category">
                <span className="category-badge">{selectedSolution.category}</span>
              </div>
              <div className="solution-description">
                <h4>Description:</h4>
                <p>{selectedSolution.description}</p>
              </div>
              <div className="solution-content">
                <h4>Solution:</h4>
                <div className="content-full">
                  {selectedSolution.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="solution-meta">
                <span>Views: {selectedSolution.views || 0}</span>
                <span>Created: {new Date(selectedSolution.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Solution Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Solution</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSolution} className="solution-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newSolution.title}
                  onChange={(e) => setNewSolution({...newSolution, title: e.target.value})}
                  required
                  className="form-input"
                  placeholder="Brief title describing the solution"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={newSolution.category}
                  onChange={(e) => setNewSolution({...newSolution, category: e.target.value})}
                  required
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newSolution.description}
                  onChange={(e) => setNewSolution({...newSolution, description: e.target.value})}
                  required
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe the problem this solution addresses"
                />
              </div>

              <div className="form-group">
                <label>Solution Content *</label>
                <textarea
                  value={newSolution.content}
                  onChange={(e) => setNewSolution({...newSolution, content: e.target.value})}
                  required
                  className="form-textarea"
                  rows="6"
                  placeholder="Detailed solution steps and information"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solutions;
