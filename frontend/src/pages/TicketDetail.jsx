import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        setError('');

        // Get current user
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          navigate('/signin');
          return;
        }
        setUser(userData);

        console.log('Fetching ticket details for ticket ID:', id);
        console.log('Current user:', { id: userData._id, username: userData.username, role: userData.role });

        // Fetch ticket details
        const ticketData = await ticketService.getTicket(id);
        console.log('Ticket fetched successfully:', ticketData);
        setTicket(ticketData);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        
        if (err.response?.status === 403) {
          setError('Access denied. You can only view tickets you created or are assigned to.');
        } else if (err.response?.status === 404) {
          setError('Ticket not found.');
        } else if (err.response?.status === 401) {
          // This should be handled by the API interceptor, but just in case
          console.log('Authentication error, redirecting to signin');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        } else {
          setError(err.response?.data?.message || 'Failed to fetch ticket details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, navigate]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsAddingComment(true);
      console.log('Adding comment to ticket:', id);
      console.log('Comment text:', newComment.trim());
      
      const updatedTicket = await ticketService.addComment(id, newComment.trim());
      console.log('Comment added successfully, updated ticket:', updatedTicket);
      
      setTicket(updatedTicket);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || 'Failed to add comment';
      alert(errorMessage);
    } finally {
      setIsAddingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#dc3545';
      case 'in progress': return '#ffc107';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const canAddComment = () => {
    if (!user || !ticket) return false;
    
    console.log('Checking comment permissions:');
    console.log('User ID:', user._id);
    console.log('User role:', user.role);
    console.log('Ticket requester user ID:', ticket.requester?.userId);
    console.log('Ticket assignee user ID:', ticket.assignee?.userId);
    
    // User can comment if they created the ticket or are assigned to it
    const canComment = (
      ticket.requester?.userId === user._id ||
      ticket.assignee?.userId === user._id ||
      user.role === 'admin' ||
      user.role === 'agent'
    );
    
    console.log('Can add comment:', canComment);
    return canComment;
  };

  if (loading) {
    return (
      <div className="ticket-detail-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-detail-page">
        <div className="error-container">
          <h2>Unable to Load Ticket</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Back to Dashboard
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="error-container">
          <h2>Ticket Not Found</h2>
          <p>The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      <div className="ticket-detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h1>Ticket Details</h1>
      </div>

      <div className="ticket-detail-container">
        {/* Ticket Information */}
        <div className="ticket-info-section">
          <div className="ticket-header">
            <div className="ticket-id-title">
              <h2>{ticket.ticketNumber || ticket._id}</h2>
              <h3>{ticket.title}</h3>
            </div>
            <div className="ticket-badges">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(ticket.status) }}
              >
                {ticket.status}
              </span>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(ticket.priority) }}
              >
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="ticket-meta">
            <div className="meta-grid">
              <div className="meta-item">
                <label>Category:</label>
                <span>{ticket.category}</span>
              </div>
              <div className="meta-item">
                <label>Created:</label>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="meta-item">
                <label>Requester:</label>
                <span>{ticket.requester?.username || 'Unknown'}</span>
              </div>
              <div className="meta-item">
                <label>Assigned to:</label>
                <span>{ticket.assignee?.username || 'Unassigned'}</span>
              </div>
              {ticket.resolvedAt && (
                <div className="meta-item">
                  <label>Resolved:</label>
                  <span>{formatDate(ticket.resolvedAt)}</span>
                </div>
              )}
              {ticket.slaDeadline && (
                <div className="meta-item">
                  <label>SLA Deadline:</label>
                  <span>{formatDate(ticket.slaDeadline)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="ticket-description">
            <h4>Description</h4>
            <div className="description-content">
              {ticket.description}
            </div>
          </div>

          {ticket.resolution && (
            <div className="ticket-resolution">
              <h4>Resolution</h4>
              <div className="resolution-content">
                {ticket.resolution}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h4>Comments ({ticket.comments?.length || 0})</h4>
          
          {ticket.comments && ticket.comments.length > 0 ? (
            <div className="comments-list">
              {ticket.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author?.username || 'Unknown'}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">
              <p>No comments yet.</p>
            </div>
          )}

          {/* Add Comment Form */}
          {canAddComment() && ticket.status !== 'Closed' && (
            <form onSubmit={handleAddComment} className="add-comment-form">
              <h5>Add a Comment</h5>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
                rows="4"
                disabled={isAddingComment}
                required
              />
              <div className="comment-form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isAddingComment || !newComment.trim()}
                >
                  {isAddingComment ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            </form>
          )}

          {!canAddComment() && (
            <div className="no-comment-permission">
              <p>You can only comment on tickets you created or are assigned to.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail; 