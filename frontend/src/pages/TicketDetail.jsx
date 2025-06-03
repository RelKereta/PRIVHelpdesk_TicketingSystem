import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';
import './TicketDetail.css';

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTicketAndUser = async () => {
      try {
        setLoading(true);
        setError('');

        // Get current user
        const userString = localStorage.getItem('user');
        console.log('🎫 TicketDetail: Raw user string from localStorage:', userString);
        
        if (!userString) {
          console.log('🎫 TicketDetail: No user data in localStorage, redirecting to signin');
          navigate('/signin');
          return;
        }

        let userData;
        try {
          userData = JSON.parse(userString);
        } catch (parseError) {
          console.error('🎫 TicketDetail: Error parsing user data:', parseError);
          navigate('/signin');
          return;
        }

        console.log('🎫 TicketDetail: Parsed user data:', userData);
        
        if (!userData || !userData._id) {
          console.log('🎫 TicketDetail: Invalid user data structure, redirecting to signin');
          navigate('/signin');
          return;
        }
        
        setUser(userData);

        // Test: First fetch all tickets to see what this user has access to
        console.log('🧪 TicketDetail: Testing - fetching all user tickets first...');
        try {
          const allTickets = await ticketService.getTickets();
          console.log('🧪 TicketDetail: User has access to these tickets:', allTickets);
          
          const targetTicket = allTickets.find(ticket => ticket._id === id);
          if (targetTicket) {
            console.log('🧪 TicketDetail: Target ticket found in user\'s accessible tickets:', targetTicket);
          } else {
            console.log('🧪 TicketDetail: Target ticket NOT found in user\'s accessible tickets');
            setError('Ticket not found or you do not have permission to view it.');
            return;
          }
        } catch (testError) {
          console.error('🧪 TicketDetail: Error in test fetch:', testError);
        }

        // Fetch ticket details
        console.log('🎫 TicketDetail: Fetching ticket with ID:', id);
        console.log('🎫 TicketDetail: Using user ID:', userData._id);
        
        const ticketData = await ticketService.getTicket(id);
        console.log('🎫 TicketDetail: Received ticket data:', ticketData);
        
        // Check if user has permission to view this ticket
        const canView = 
          userData.role === 'admin' || 
          userData.role === 'agent' || 
          (ticketData.requester && ticketData.requester.userId === userData._id);

        console.log('🎫 TicketDetail: Permission check:', {
          userRole: userData.role,
          userId: userData._id,
          ticketRequesterId: ticketData.requester?.userId,
          canView: canView
        });

        if (!canView) {
          console.log('🎫 TicketDetail: Access denied');
          setError('You do not have permission to view this ticket.');
          return;
        }

        console.log('🎫 TicketDetail: Access granted, setting ticket data');
        setTicket(ticketData);
      } catch (err) {
        console.error('🎫 TicketDetail: Error fetching ticket:', err);
        console.error('🎫 TicketDetail: Error response:', err.response?.data);
        console.error('🎫 TicketDetail: Error status:', err.response?.status);
        
        // Don't redirect to login on API errors, show error message instead
        if (err.response?.status === 404) {
          setError('Ticket not found.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this ticket.');
        } else if (err.response?.status === 401) {
          setError('Authentication failed. Please sign in again.');
          // Only redirect on auth errors, not other errors
          setTimeout(() => navigate('/signin'), 2000);
        } else {
          setError('Failed to load ticket details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndUser();
  }, [id, navigate]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await ticketService.addComment(id, newComment.trim());
      
      // Refresh ticket data to show new comment
      const updatedTicket = await ticketService.getTicket(id);
      setTicket(updatedTicket);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#dc3545';
      case 'In Progress': return '#007bff';
      case 'Pending Approval': return '#ffc107';
      case 'Resolved': return '#28a745';
      case 'Closed': return '#6c757d';
      default: return '#6c757d';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="error-container">
          <h2>Ticket Not Found</h2>
          <p>The requested ticket could not be found.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      <div className="ticket-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Ticket Details</h1>
      </div>

      <div className="ticket-detail-container">
        <div className="ticket-info-section">
          <div className="ticket-header-info">
            <div className="ticket-id-title">
              <h2>{ticket.title}</h2>
              <span className="ticket-id">{ticket.ticketNumber || ticket._id}</span>
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

          <div className="ticket-meta-info">
            <div className="meta-item">
              <strong>Requester:</strong>
              <span>{ticket.requester?.username || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <strong>Department:</strong>
              <span>{ticket.requester?.department || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <strong>Created:</strong>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.assignee && (
              <div className="meta-item">
                <strong>Assigned to:</strong>
                <span>{ticket.assignee.username}</span>
              </div>
            )}
            {ticket.resolvedAt && (
              <div className="meta-item">
                <strong>Resolved:</strong>
                <span>{formatDate(ticket.resolvedAt)}</span>
              </div>
            )}
          </div>

          <div className="ticket-description">
            <h3>Description</h3>
            <div className="description-content">
              {ticket.description || 'No description provided.'}
            </div>
          </div>

          {ticket.resolution && (
            <div className="ticket-resolution">
              <h3>Resolution</h3>
              <div className="resolution-content">
                {ticket.resolution}
              </div>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h3>Comments & Updates</h3>
          
          <div className="comments-list">
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.author?.username || 'Unknown'}
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="comment-text">
                    {comment.text}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet.</p>
            )}
          </div>

          {/* Only show comment form if ticket is not closed/resolved and user is the requester or agent/admin */}
          {(ticket.status !== 'Closed' && ticket.status !== 'Resolved') && 
           (user?.role === 'admin' || user?.role === 'agent' || 
            (ticket.requester && ticket.requester.userId === user?._id)) && (
            <form onSubmit={handleAddComment} className="add-comment-form">
              <h4>Add Comment</h4>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment or question..."
                rows="4"
                required
                disabled={submittingComment}
              />
              <button 
                type="submit" 
                disabled={submittingComment || !newComment.trim()}
                className="submit-comment-button"
              >
                {submittingComment ? 'Adding Comment...' : 'Add Comment'}
              </button>
            </form>
          )}

          {(ticket.status === 'Closed' || ticket.status === 'Resolved') && (
            <div className="ticket-closed-notice">
              <p>This ticket has been {ticket.status.toLowerCase()}. No further comments can be added.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketDetail; 