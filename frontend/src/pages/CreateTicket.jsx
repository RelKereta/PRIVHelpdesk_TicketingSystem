import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './CreateTicket.css';

function CreateTicket() {
  const navigate = useNavigate();
  
  // Initialize state for ticket form data
  const [ticketData, setTicketData] = useState({
    subject: '',
    priority: 'Medium', 
    type: 'Question',
    team: '', // Which team/division handling the ticket
    description: '', // Added for description
  });

  // Handle input size change and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData, // Spread the existing state
      [name]: value, // Dynamically update the field value based on name
    });
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Avoid unwanted refresh
    console.log('Ticket data submitted:', ticketData);

    // Create new ticket object including default user info
    const newTicket = {
      ...ticketData,
      userId: '12345',  // Default user ID
      username: 'John Doe',  // Default username
      id: Date.now(),
      status: 'Open',
      contact: 'System Assigned',
      resolvedDate: null,
      createdDate: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:3000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        alert('✅ Ticket successfully created!'); // Show success message
        setTicketData({ // Reset form fields to empty
          subject: '',
          priority: 'Medium',
          type: 'Question',
          team: '',
          description: '',
        });
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        alert('❌ Failed to create ticket'); // Show failure message
      }
    } catch (error) {
      alert('❌ Error: ' + error.message); // Show error message
    }
  };

  return (
    <div>
      <Header />
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
              value={ticketData.description}
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
