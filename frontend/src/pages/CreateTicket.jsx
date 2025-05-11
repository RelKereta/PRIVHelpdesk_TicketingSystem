import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTicket.css';

function CreateTicket() {
  const navigate = useNavigate();
  
  const [ticketData, setTicketData] = useState({
    subject: '',
    priority: 'Medium',
    type: 'Question',
    team: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ticket data submitted:', ticketData);
    const newTicket = {
      ...ticketData,
      id: Date.now(),
      status: 'Open',
      contact: 'System Assigned',
      resolvedDate: null,
      createdDate: new Date().toISOString()
    };
    console.log('New ticket created:', newTicket);
    navigate('/');
  };

  return (
    <div>
      <div className="create-ticket-container">
        <div className="create-ticket-header">
          <h1>Create New Ticket</h1>
        </div>
        
        <form className="create-ticket-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={ticketData.subject}
              onChange={handleChange}
              required
              placeholder="Enter a clear subject that describes your issue"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={ticketData.priority}
              onChange={handleChange}
              required
            >
              <option value="Critical">Critical (3h resolution)</option>
              <option value="High">High (5h resolution)</option>
              <option value="Medium">Medium (8h resolution)</option>
              <option value="Low">Low (16h resolution)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={ticketData.type}
              onChange={handleChange}
              required
            >
              <option value="Question">Question</option>
              <option value="Incident">Incident</option>
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Unspecified">Unspecified</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="team">Your Team *</label>
            <select
              id="team"
              name="team"
              value={ticketData.team}
              onChange={handleChange}
              required
            >
              <option value="">Select your team</option>
              <option value="Billing">Billing</option>
              <option value="Product Experts">Product Experts</option>
              <option value="IT Support">IT Support</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={ticketData.description || ''}
              onChange={handleChange}
              placeholder="Please provide additional details about your issue"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="submit-button">Submit Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;