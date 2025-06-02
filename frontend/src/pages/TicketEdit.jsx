import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService, userService } from '../services/api';
import './TicketEdit.css';

const TicketEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ticketData = await ticketService.getTicket(id);
        setTicket(ticketData);
        setForm({
          title: ticketData.title,
          description: ticketData.description,
          status: ticketData.status,
          priority: ticketData.priority,
          category: ticketData.category,
          assignee: ticketData.assignee?.userId || ''
        });
        const usersData = await userService.getUsers();
        setUsers(usersData.filter(u => u.role === 'agent' || u.role === 'admin'));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updateData = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        category: form.category
      };
      await ticketService.updateTicket(id, updateData);
      if (form.assignee && form.assignee !== ticket.assignee?.userId) {
        await ticketService.assignTicket(id, form.assignee);
      }
      const updated = await ticketService.getTicket(id);
      setTicket(updated);
      setError('');
      alert('Ticket updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = async () => {
    setSaving(true);
    setError('');
    try {
      await ticketService.resolveTicket(id, 'Resolved by admin');
      const updated = await ticketService.getTicket(id);
      setTicket(updated);
      setForm(f => ({ ...f, status: 'Resolved' }));
      alert('Ticket resolved!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    setDeleting(true);
    setError('');
    try {
      await ticketService.deleteTicket(id);
      alert('Ticket deleted!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ticket');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComment = async e => {
    e.preventDefault();
    setCommenting(true);
    setError('');
    try {
      await ticketService.addComment(id, comment);
      setComment('');
      const updated = await ticketService.getTicket(id);
      setTicket(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading ticket...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!ticket) return <div className="not-found-state">Ticket not found</div>;

  return (
    <div className="edit-ticket-page">
      <div className="edit-ticket-header">
        <h2>Edit Ticket</h2>
        <p>Ticket ID: {ticket._id}</p>
      </div>

      <form className="ticket-edit-form" onSubmit={handleSave}>
        <div className="form-section">
          <h3>Ticket Information</h3>
          
          <div className="form-group">
            <label>Title</label>
            <input 
              className="form-input"
              name="title" 
              value={form.title || ''} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-textarea"
              name="description" 
              value={form.description || ''} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select 
                className="form-select"
                name="status" 
                value={form.status || ''} 
                onChange={handleChange} 
                required
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select 
                className="form-select"
                name="priority" 
                value={form.priority || ''} 
                onChange={handleChange} 
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select 
                className="form-select"
                name="category" 
                value={form.category || ''} 
                onChange={handleChange} 
                required
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assign to</label>
              <select 
                className="form-select"
                name="assignee" 
                value={form.assignee || ''} 
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            className="btn btn-success" 
            onClick={handleResolve} 
            disabled={saving || form.status === 'Resolved'}
          >
            Resolve
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={handleDelete} 
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </form>

      <div className="comments-section">
        <div className="comments-header">
          <h3>Comments</h3>
        </div>
        
        <div className="comments-list">
          {ticket.comments && ticket.comments.length > 0 ? (
            ticket.comments.map((c, i) => (
              <div key={i} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    {c.author?.username || 'Unknown'}
                  </span>
                  <span className="comment-date">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            ))
          ) : (
            <div className="comment-item">
              <p className="comment-text" style={{ fontStyle: 'italic', color: '#888' }}>
                No comments yet.
              </p>
            </div>
          )}
        </div>

        <form className="comment-form" onSubmit={handleAddComment}>
          <div className="comment-input-group">
            <input 
              className="comment-input"
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              placeholder="Add a comment..." 
              required 
            />
            <button 
              type="submit" 
              className="btn-add-comment" 
              disabled={commenting || !comment.trim()}
            >
              {commenting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketEdit; 