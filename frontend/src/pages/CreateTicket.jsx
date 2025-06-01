import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import './CreateTicket.css';

function CreateTicket() {
  const navigate = useNavigate();
  const { addTicket, CATEGORY_PRIORITY_MAPPING } = useTickets();
  const { user } = useAuth();
  
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    category: '',
    type: 'Technical Issue',
    priority: '',
    urgency: 'Medium',
    impact: 'Medium',
    team: '',
    attachments: [],
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'System Outage',
    'Security Incident', 
    'Application Error',
    'Network Issue',
    'Hardware Problem',
    'Software Installation',
    'Access Request',
    'General Inquiry',
    'Password Reset',
    'Account Setup',
    'Email Issues',
    'Printer Problems',
    'VPN Connection',
    'Database Issues'
  ];

  const ticketTypes = [
    'Technical Issue',
    'Access Request',
    'Hardware Request',
    'Software Request',
    'Change Request',
    'Incident',
    'Service Request',
    'Bug Report',
    'Feature Request'
  ];

  const teams = [
    'IT Support',
    'Network Team',
    'Security Team',
    'Database Team',
    'Application Support',
    'Hardware Team',
    'Help Desk'
  ];

  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
  const impactLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-assign priority based on category
      if (name === 'category' && value) {
        updated.priority = CATEGORY_PRIORITY_MAPPING[value] || 'Medium';
      }
      
      // Auto-assign team based on category
      if (name === 'category' && value) {
        const teamMapping = {
          'System Outage': 'IT Support',
          'Security Incident': 'Security Team',
          'Network Issue': 'Network Team',
          'Database Issues': 'Database Team',
          'Hardware Problem': 'Hardware Team',
          'Software Installation': 'Application Support'
        };
        updated.team = teamMapping[value] || 'IT Support';
      }
      
      return updated;
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setTicketData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setTicketData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const calculatePriority = () => {
    const urgencyWeight = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    const impactWeight = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    
    const score = urgencyWeight[ticketData.urgency] + impactWeight[ticketData.impact];
    
    if (score >= 7) return 'Critical';
    if (score >= 5) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalPriority = ticketData.priority || calculatePriority();
      const tagsArray = ticketData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const newTicket = {
        ...ticketData,
        priority: finalPriority,
        tags: tagsArray,
        requesterName: user?.name || 'Current User',
        requesterEmail: user?.email || 'user@priv.com',
        requesterDepartment: user?.department || 'Unknown'
      };

      const createdTicket = addTicket(newTicket);
      
      // Show success message
      alert(`Ticket ${createdTicket.id} created successfully!${createdTicket.approvalRequired ? ' This ticket requires approval.' : ''}`);
      
      navigate('/dashboard');
    } catch (error) {
      alert('Error creating ticket. Please try again.');
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const currentPriority = ticketData.priority || calculatePriority();

  return (
    <div className="create-ticket-page">
      <div className="create-ticket-header">
        <h1>Create New Ticket</h1>
        <p>Submit a support request and we'll help you resolve your issue</p>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={ticketData.subject}
                onChange={handleChange}
                required
                placeholder="Brief description of your issue"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={ticketData.category}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={ticketData.type}
                onChange={handleChange}
                required
                className="form-input"
              >
                {ticketTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="team">Assigned Team</label>
              <select
                id="team"
                name="team"
                value={ticketData.team}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Auto-assign based on category</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Priority Assessment</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="urgency">Urgency</label>
              <select
                id="urgency"
                name="urgency"
                value={ticketData.urgency}
                onChange={handleChange}
                className="form-input"
              >
                {urgencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <small>How quickly does this need to be resolved?</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="impact">Impact</label>
              <select
                id="impact"
                name="impact"
                value={ticketData.impact}
                onChange={handleChange}
                className="form-input"
              >
                {impactLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <small>How many people/systems are affected?</small>
            </div>
          </div>

          <div className="priority-indicator">
            <label>Calculated Priority:</label>
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(currentPriority) }}
            >
              {currentPriority}
            </span>
          </div>
        </div>

        <div className="form-section">
          <h3>Details</h3>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={ticketData.description}
              onChange={handleChange}
              required
              placeholder="Please provide detailed information about your issue, including steps to reproduce, error messages, and any troubleshooting you've already tried"
              className="form-textarea"
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={ticketData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., login, password, urgent)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileUpload}
              className="form-input file-input"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip"
            />
            <small>Supported formats: Images, PDF, Documents, Text files, ZIP (Max 10MB each)</small>
            
            {ticketData.attachments.length > 0 && (
              <div className="attachments-list">
                <h4>Attached Files:</h4>
                {ticketData.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="remove-attachment"
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
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;
