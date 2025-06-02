import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';
import './CreateTicket.css';

const CreateTicket = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    attachments: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)
      };

      const response = await ticketService.createTicket(ticketData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    };
    return colors[priority.toLowerCase()] || '#6c757d';
  };

  return (
    <div className="create-ticket-page">
      <div className="create-ticket-header">
        <h1>Create New Ticket</h1>
        <p>Fill out the form below to create a new support ticket</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-section">
          <h3>Ticket Details</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the issue"
            />
            <small>Keep it concise but descriptive</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Detailed description of the issue"
              rows="5"
            />
            <small>Include any relevant details, steps to reproduce, and expected behavior</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <div className="priority-indicator">
                <label>Selected Priority:</label>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(formData.priority) }}
                >
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Attachments</h3>
          <div className="form-group">
            <label htmlFor="attachments">Add Files</label>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
            <small>You can attach multiple files (max 5MB each)</small>
            
            {formData.attachments.length > 0 && (
              <div className="attachments-list">
                <h4>Attached Files</h4>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      className="remove-attachment"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
