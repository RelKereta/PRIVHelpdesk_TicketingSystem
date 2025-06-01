import React, { useState } from 'react';
import './Solutions.css';

function Solutions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for solved tickets and documentation
  const solutions = [
    {
      id: 'SOL-001',
      title: 'Login Issues Resolution Guide',
      category: 'Authentication',
      description: 'Step-by-step guide to resolve common login problems including password reset and account lockouts.',
      resolution: 'Clear browser cache, reset password using company email, contact IT if domain issues persist.',
      dateResolved: '2024-01-15',
      resolvedBy: 'John Smith',
      tags: ['login', 'password', 'authentication'],
      helpfulVotes: 24
    },
    {
      id: 'SOL-002',
      title: 'Network Connectivity Problems',
      category: 'Network',
      description: 'Common network connectivity issues and their solutions for remote workers.',
      resolution: 'Check Wi-Fi connection, restart router, verify VPN settings, run network diagnostics.',
      dateResolved: '2024-01-10',
      resolvedBy: 'Sarah Johnson',
      tags: ['network', 'wifi', 'vpn', 'remote'],
      helpfulVotes: 18
    },
    {
      id: 'SOL-003',
      title: 'Software Installation Error Fix',
      category: 'Software',
      description: 'Resolving installation errors for company applications on Windows and Mac.',
      resolution: 'Run as administrator, check system requirements, disable antivirus temporarily, clear temp files.',
      dateResolved: '2024-01-08',
      resolvedBy: 'Mike Chen',
      tags: ['software', 'installation', 'windows', 'mac'],
      helpfulVotes: 31
    },
    {
      id: 'SOL-004',
      title: 'Email Configuration Setup',
      category: 'Email',
      description: 'Complete guide for setting up company email on mobile devices and desktop clients.',
      resolution: 'Use IMAP settings: server mail.company.com, port 993, SSL enabled, authenticate with company credentials.',
      dateResolved: '2024-01-05',
      resolvedBy: 'Lisa Wang',
      tags: ['email', 'mobile', 'outlook', 'configuration'],
      helpfulVotes: 27
    },
    {
      id: 'SOL-005',
      title: 'Printer Connection Issues',
      category: 'Hardware',
      description: 'Troubleshooting guide for connecting to office printers from various devices.',
      resolution: 'Install printer drivers, check network connection, add printer via IP address, restart print spooler.',
      dateResolved: '2024-01-03',
      resolvedBy: 'David Brown',
      tags: ['printer', 'hardware', 'drivers', 'network'],
      helpfulVotes: 15
    },
    {
      id: 'SOL-006',
      title: 'File Sharing Permissions Error',
      category: 'Access Control',
      description: 'Resolving file sharing and permission errors on company shared drives.',
      resolution: 'Contact domain admin to verify group membership, clear cached credentials, remount shared drive.',
      dateResolved: '2024-01-01',
      resolvedBy: 'Emily Davis',
      tags: ['permissions', 'file-sharing', 'access', 'domain'],
      helpfulVotes: 22
    }
  ];

  const categories = ['all', 'Authentication', 'Network', 'Software', 'Email', 'Hardware', 'Access Control'];

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="solutions-page">
      <div className="solutions-header">
        <h1>Solutions</h1>
        <p>Browse our knowledge base of solved tickets and helpful documentation</p>
      </div>

      {/* Search and Filter Section */}
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

      {/* Results Counter */}
      <div className="results-info">
        <span>Showing {filteredSolutions.length} of {solutions.length} solutions</span>
      </div>

      {/* Solutions Grid */}
      <div className="solutions-grid">
        {filteredSolutions.map(solution => (
          <div key={solution.id} className="solution-card">
            <div className="solution-header">
              <div className="solution-id">{solution.id}</div>
              <div className="solution-category">{solution.category}</div>
            </div>
            
            <div className="solution-content">
              <h3 className="solution-title">{solution.title}</h3>
              <p className="solution-description">{solution.description}</p>
              
              <div className="solution-resolution">
                <h4>Resolution:</h4>
                <p>{solution.resolution}</p>
              </div>
              
              <div className="solution-tags">
                {solution.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="solution-footer">
              <div className="solution-meta">
                <span>Resolved by {solution.resolvedBy}</span>
                <span>{formatDate(solution.dateResolved)}</span>
              </div>
              <div className="solution-votes">
                <button className="vote-btn">
                  👍 {solution.helpfulVotes}
                </button>
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

      {/* Quick Stats */}
      <div className="solutions-stats">
        <div className="stat-item">
          <div className="stat-number">{solutions.length}</div>
          <div className="stat-label">Total Solutions</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{categories.length - 1}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{solutions.reduce((sum, sol) => sum + sol.helpfulVotes, 0)}</div>
          <div className="stat-label">Helpful Votes</div>
        </div>
      </div>
    </div>
  );
}

export default Solutions;
