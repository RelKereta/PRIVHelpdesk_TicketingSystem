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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Format the data according to the backend expectations
      const ticketData = new FormData();
      ticketData.append('title', formData.title.trim());
      ticketData.append('description', formData.description.trim());
      ticketData.append('category', formData.category);
      ticketData.append('priority', formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1));

      formData.attachments.forEach(file => {
        ticketData.append('attachments', file);
      });

      console.log('Submitting ticket data:', ticketData);
      const response = await ticketService.createTicket(ticketData);
      console.log('Ticket created successfully:', response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="create-ticket-header">
        <h1>Create New Ticket</h1>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the issue"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Detailed description of the issue"
              rows="5"
              className="form-textarea"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-input"
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
          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
            {formData.attachments.length > 0 && (
              <div className="attachments-list">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <span className="file-name">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
