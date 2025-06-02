import React, { useState, useEffect } from 'react';
import { solutionService } from '../services/api';
import './Solutions.css';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdminOrAgent = user?.role === 'admin' || user?.role === 'agent';

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await solutionService.getSolutions();
      setSolutions(response);
    } catch (error) {
      setError('Failed to fetch solutions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (solution) => {
    setSelectedSolution(solution);
    setFormData({
      title: solution.title,
      description: solution.description,
      category: solution.category,
      content: solution.content
    });
    setShowModal(true);
  };

  const handleDelete = async (solutionId) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await solutionService.deleteSolution(solutionId);
        setSolutions(solutions.filter(s => s._id !== solutionId));
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete solution';
        setError(errorMessage);
        console.error('Error deleting solution:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSolution) {
        const updated = await solutionService.updateSolution(selectedSolution._id, formData);
        setSolutions(solutions.map(s => s._id === selectedSolution._id ? updated : s));
      } else {
        const newSolution = await solutionService.createSolution(formData);
        setSolutions([newSolution, ...solutions]);
      }
      setShowModal(false);
      setSelectedSolution(null);
      setFormData({ title: '', description: '', category: '', content: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save solution';
      setError(errorMessage);
      console.error('Error saving solution:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading solutions...</div>;
  }

  const categories = ['Account Management', 'Network', 'Software', 'Hardware', 'Other'];

  return (
    <div className="solutions-page">
      <div className="solutions-header">
        <h1>Knowledge Base Solutions</h1>
        <p>Find answers to common questions and technical issues</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="solutions-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search solutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {isAdminOrAgent && (
          <button 
            className="add-solution-btn"
            onClick={() => {
              setSelectedSolution(null);
              setFormData({ title: '', description: '', category: '', content: '' });
              setShowModal(true);
            }}
          >
            Add New Solution
          </button>
        )}
      </div>

      <div className="results-info">
        Showing {filteredSolutions.length} solutions
      </div>

      {filteredSolutions.length === 0 ? (
        <div className="no-results">
          <h3>No solutions found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="solutions-grid">
          {filteredSolutions.map(solution => (
            <div key={solution._id} className="solution-card">
              <div className="solution-header">
                <span className="solution-category">{solution.category}</span>
                {isAdminOrAgent && (
                  <div className="solution-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(solution)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(solution._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="solution-content">
                <h3>{solution.title}</h3>
                <p className="solution-description">{solution.description}</p>
              </div>
              <div className="solution-footer">
                <div className="solution-meta">
                  <span>{solution.views} views</span>
                  <span>Created {new Date(solution.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedSolution ? 'Edit Solution' : 'Add New Solution'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="solution-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="form-textarea"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedSolution ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
