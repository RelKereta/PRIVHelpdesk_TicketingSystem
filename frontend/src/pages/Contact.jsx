import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    urgency: 'medium'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create email content
    const emailSubject = encodeURIComponent(`Contact Form: ${formData.subject}`);
    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Urgency: ${formData.urgency}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}`
    );
    
    // Open default email client with pre-filled content
    window.location.href = `mailto:farrell.arya@binus.ac.id?subject=${emailSubject}&body=${emailBody}`;
    
    // Reset form after opening email client
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      urgency: 'medium'
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Support</h1>
        <p>Get in touch with our customer service team for urgent issues or general inquiries</p>
      </div>

      <div className="contact-container">
        {/* Contact Information */}
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📞</div>
              <div className="method-details">
                <h3>Phone Support</h3>
                <p className="primary-contact">+1 (555) 123-4567</p>
                <p className="hours">Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p className="hours">Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">📧</div>
              <div className="method-details">
                <h3>Email Support</h3>
                <p className="primary-contact">farrell.arya@binus.ac.id</p>
                <p className="hours">Response within 24 hours</p>
                <p className="hours">Priority tickets: 4 hours</p>
              </div>
            </div>

            <div className="contact-method emergency">
              <div className="method-icon">🚨</div>
              <div className="method-details">
                <h3>Emergency Hotline</h3>
                <p className="primary-contact">+1 (555) 911-HELP</p>
                <p className="hours">24/7 for critical issues</p>
                <p className="hours">System outages, security breaches</p>
              </div>
            </div>
          </div>

          <div className="office-info">
            <h3>Office Location</h3>
            <div className="address">
              <p>PRIV Helpdesk Solutions</p>
              <p>Jl. Jenderal Sudirman, Gelora</p>
              <p>Kecamatan Tanah Abang</p>
              <p>Kota Jakarta Pusat</p>
              <p>Daerah Khusus Ibukota Jakarta 10270</p>
              <p>Indonesia</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <p>For non-urgent inquiries, you can send us a message using the form below. This will open your default email client to send a message to farrell.arya@binus.ac.id.</p>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency Level</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Low - General inquiry</option>
                <option value="medium">Medium - Standard support</option>
                <option value="high">High - Urgent issue</option>
                <option value="critical">Critical - Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="form-textarea"
                rows="5"
                placeholder="Please provide detailed information about your inquiry or issue..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="quick-help">
        <h2>Quick Help</h2>
        <p>Before contacting support, you might find your answer in our frequently asked questions.</p>
        <div className="help-links">
          <a href="/resources" className="help-link">
            <span className="link-icon">❓</span>
            <span>Browse FAQs</span>
          </a>
          <a href="/solutions" className="help-link">
            <span className="link-icon">💡</span>
            <span>View Solutions</span>
          </a>
          <a href="/create-ticket" className="help-link">
            <span className="link-icon">🎫</span>
            <span>Create Ticket</span>
          </a>
          <a href="/chatbot" className="help-link">
            <span className="link-icon">🤖</span>
            <span>AI Assistant</span>
          </a>
        </div>
      </div>

      {/* Response Times */}
      <div className="response-times">
        <h2>Expected Response Times</h2>
        <div className="response-grid">
          <div className="response-item">
            <div className="response-level low">Low Priority</div>
            <div className="response-time">72 hours</div>
          </div>
          <div className="response-item">
            <div className="response-level medium">Medium Priority</div>
            <div className="response-time">24 hours</div>
          </div>
          <div className="response-item">
            <div className="response-level high">High Priority</div>
            <div className="response-time">8 hours</div>
          </div>
          <div className="response-item">
            <div className="response-level critical">Critical</div>
            <div className="response-time">2 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
