import React, { useState } from 'react';
import './Resources.css';

function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Mock data for FAQs
  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your email. If you don\'t receive an email within 5 minutes, check your spam folder or contact IT support.',
      category: 'Account',
      tags: ['password', 'login', 'account']
    },
    {
      id: 2,
      question: 'How do I create a new ticket?',
      answer: 'Click on the "Issue New Ticket" button on the dashboard. Fill in the required information including subject, priority, type, and description. Make sure to select the appropriate team and provide as much detail as possible to help us resolve your issue quickly.',
      category: 'Tickets',
      tags: ['ticket', 'create', 'support']
    },
    {
      id: 3,
      question: 'What are the different ticket priorities?',
      answer: 'We have four priority levels: Low (72h response), Medium (24h response), High (8h response), and Critical (2h response). Critical issues include system outages, security breaches, or anything that prevents business operations.',
      category: 'Tickets',
      tags: ['priority', 'response-time', 'sla']
    },
    {
      id: 4,
      question: 'How can I track my ticket status?',
      answer: 'You can track your tickets on the Dashboard or Tickets page. Each ticket shows its current status: Open, In Progress, Resolved, or Closed. You\'ll also receive email notifications when your ticket status changes.',
      category: 'Tickets',
      tags: ['status', 'tracking', 'notifications']
    },
    {
      id: 5,
      question: 'Who can access the helpdesk system?',
      answer: 'All company employees with valid credentials can access the helpdesk system. Access levels may vary based on your role and department. Contact your manager or IT administrator if you need access or have permission issues.',
      category: 'Access',
      tags: ['access', 'permissions', 'employees']
    }
  ];

  const categories = ['all', 'Account', 'Tickets', 'Access', 'Technical', 'Settings', 'Support'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resources</h1>
        <p>Find answers to frequently asked questions and helpful guides</p>
      </div>

      {/* Search and Filter Section */}
      <div className="resources-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search FAQs..."
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

      {/* Results Counter */}
      <div className="results-info">
        <span>Showing {filteredFAQs.length} of {faqs.length} questions</span>
      </div>

      {/* FAQ List */}
      <div className="faq-list">
        {filteredFAQs.map(faq => (
          <div key={faq.id} className="faq-item">
            <div 
              className="faq-question" 
              onClick={() => toggleFAQ(faq.id)}
            >
              <div className="question-content">
                <span className="category-badge">{faq.category}</span>
                <h3>{faq.question}</h3>
              </div>
              <div className="expand-icon">
                {expandedFAQ === faq.id ? '−' : '+'}
              </div>
            </div>
            
            {expandedFAQ === faq.id && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
                <div className="faq-tags">
                  {faq.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="no-results">
          <h3>No FAQs found</h3>
          <p>Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
}

export default Resources;
