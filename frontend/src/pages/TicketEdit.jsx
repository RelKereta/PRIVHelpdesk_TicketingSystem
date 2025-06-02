import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService, userService } from '../services/api';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div style={{maxWidth:600,margin:'2rem auto',padding:'2rem',background:'#fff',borderRadius:8}}>
      <h2>Edit Ticket</h2>
      <form onSubmit={handleSave}>
        <label>Title<input name="title" value={form.title} onChange={handleChange} required /></label><br/>
        <label>Description<textarea name="description" value={form.description} onChange={handleChange} required /></label><br/>
        <label>Status
          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </label><br/>
        <label>Priority
          <select name="priority" value={form.priority} onChange={handleChange} required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label><br/>
        <label>Category
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>
        </label><br/>
        <label>Assign to
          <select name="assignee" value={form.assignee} onChange={handleChange}>
            <option value="">Unassigned</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username} ({u.role})</option>
            ))}
          </select>
        </label><br/>
        <button type="submit" disabled={saving}>Save</button>
        <button type="button" onClick={handleResolve} disabled={saving || form.status==='Resolved'} style={{marginLeft:8}}>Resolve</button>
        <button type="button" onClick={handleDelete} disabled={deleting} style={{marginLeft:8, color:'red'}}>Delete</button>
      </form>
      <hr/>
      <h3>Comments</h3>
      <ul>
        {ticket.comments && ticket.comments.map((c,i) => (
          <li key={i}><b>{c.author?.username||'Unknown'}:</b> {c.text} <i style={{fontSize:'0.8em',color:'#888'}}>{new Date(c.createdAt).toLocaleString()}</i></li>
        ))}
      </ul>
      <form onSubmit={handleAddComment} style={{marginTop:'1em'}}>
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment..." required style={{width:'80%'}} />
        <button type="submit" disabled={commenting || !comment.trim()}>Add</button>
      </form>
    </div>
  );
};

export default TicketEdit; 