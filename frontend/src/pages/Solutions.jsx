import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Solutions.css';

function Solutions() {
  const { user, isTechnician, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [solutions, setSolutions] = useState([
    {
      id: 'SOL-001',
      title: 'Login Issues Resolution Guide',
      category: 'Authentication',
      description: 'Step-by-step guide to resolve common login problems including password reset and account lockouts.',
      resolution: 'Clear browser cache, reset password using company email, contact IT if domain issues persist.',
      dateResolved: '2024-01-15',
      resolvedBy: 'John Smith',
      tags: ['login', 'password', 'authentication'],
      helpfulVotes: 24,
      steps: [
        'Clear browser cache and cookies',
        'Try incognito/private browsing mode',
        'Reset password using forgot password link',
        'Check if account is locked',
        'Contact IT if issues persist'
      ]
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
      helpfulVotes: 18,
      steps: [
        'Check Wi-Fi signal strength',
        'Restart network adapter',
        'Restart router/modem',
        'Check VPN connection',
        'Run Windows Network Troubleshooter',
        'Contact ISP if needed'
      ]
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
      helpfulVotes: 31,
      steps: [
        'Check system requirements',
        'Run installer as administrator',
        'Temporarily disable antivirus',
        'Clear temporary files',
        'Check available disk space',
        'Restart and retry installation'
      ]
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
      helpfulVotes: 27,
      steps: [
        'Open email client settings',
        'Select IMAP configuration',
        'Enter server: mail.company.com',
        'Set port to 993 with SSL',
        'Enter company credentials',
        'Test send/receive functionality'
      ]
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
      helpfulVotes: 15,
      steps: [
        'Check printer power and network connection',
        'Download latest printer drivers',
        'Add printer using IP address',
        'Restart print spooler service',
        'Set as default printer if needed',
        'Test print functionality'
      ]
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
      helpfulVotes: 22,
      steps: [
        'Check user group membership',
        'Clear cached credentials',
        'Disconnect and reconnect network drive',
        'Verify folder permissions',
        'Contact domain administrator',
        'Test access with different user'
      ]
    }
  ]);

  const [newSolution, setNewSolution] = useState({
    title: '',
    category: '',
    description: '',
    resolution: '',
    tags: '',
    steps: ['']
  });

  const categories = ['all', 'Authentication', 'Network', 'Software', 'Email', 'Hardware', 'Access Control', 'Database', 'Security'];

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVote = (solutionId) => {
    setSolutions(prev => prev.map(solution => 
      solution.id === solutionId 
        ? { ...solution, helpfulVotes: solution.helpfulVotes + 1 }
        : solution
    ));
  };

  const handleCreateSolution = (e) => {
    e.preventDefault();
    const solution = {
      id: `SOL-${String(solutions.length + 1).padStart(3, '0')}`,
      ...newSolution,
      tags: newSolution.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      steps: newSolution.steps.filter(step => step.trim()),
      dateResolved: new Date().toISOString().split('T')[0],
      resolvedBy: user?.name || 'Current User',
      helpfulVotes: 0
    };

    setSolutions(prev => [...prev, solution]);
    setNewSolution({
      title: '',
      category: '',
      description: '',
      resolution: '',
      tags: '',
      steps: ['']
    });
    setShowCreateModal(false);
    alert('Solution added to knowledge base successfully!');
  };

  const addStep = () => {
    setNewSolution(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index, value) => {
    setNewSolution(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const removeStep = (index) => {
    setNewSolution(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

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
          <div key={solution.id} className="solution-card">
            <div className="solution-header">
              <h3>{solution.title}</h3>
              <span className="category-badge">{solution.category}</span>
            </div>
            
            <p className="solution-description">{solution.description}</p>
            
            <div className="solution-resolution">
              <h4>Quick Resolution:</h4>
              <p>{solution.resolution}</p>
            </div>

            {solution.steps && solution.steps.length > 0 && (
              <div className="solution-steps">
                <h4>Step-by-step Guide:</h4>
                <ol>
                  {solution.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            
            <div className="solution-tags">
              {solution.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            
            <div className="solution-footer">
              <div className="solution-meta">
                <span>By {solution.resolvedBy}</span>
                <span>{new Date(solution.dateResolved).toLocaleDateString()}</span>
              </div>
              <div className="solution-actions">
                <button 
                  onClick={() => handleVote(solution.id)}
                  className="vote-btn"
                >
                  👍 Helpful ({solution.helpfulVotes})
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

              <div className="form-row">
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
                  <label>Tags</label>
                  <input
                    type="text"
                    value={newSolution.tags}
                    onChange={(e) => setNewSolution({...newSolution, tags: e.target.value})}
                    className="form-input"
                    placeholder="Comma-separated tags"
                  />
                </div>
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
                <label>Quick Resolution *</label>
                <textarea
                  value={newSolution.resolution}
                  onChange={(e) => setNewSolution({...newSolution, resolution: e.target.value})}
                  required
                  className="form-textarea"
                  rows="3"
                  placeholder="Brief summary of the solution"
                />
              </div>

              <div className="form-group">
                <label>Step-by-step Guide</label>
                {newSolution.steps.map((step, index) => (
                  <div key={index} className="step-input-group">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="form-input"
                      placeholder={`Step ${index + 1}`}
                    />
                    {newSolution.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="remove-step-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="add-step-btn"
                >
                  + Add Step
                </button>
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
