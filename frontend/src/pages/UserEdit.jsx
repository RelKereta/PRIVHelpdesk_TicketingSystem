import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './UserEdit.css';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchUser();
  }, [id, isAdmin, navigate]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await userService.getUser(id);
      setUser(userData);
      setForm({
        username: userData.username,
        email: userData.email,
        role: userData.role,
        department: userData.department || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Validate required fields
      if (!form.username?.trim() || !form.email?.trim() || !form.role) {
        throw new Error('Username, email, and role are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        throw new Error('Please enter a valid email address');
      }

      const updateData = {
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        department: form.department?.trim() || null,
        firstName: form.firstName?.trim() || null,
        lastName: form.lastName?.trim() || null,
        phone: form.phone?.trim() || null
      };

      await userService.updateUser(id, updateData);
      const updated = await userService.getUser(id);
      setUser(updated);
      setError('');
      alert('User updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (currentUser._id === id) {
      alert('You cannot delete your own account!');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError('');
    
    try {
      await userService.deleteUser(id);
      alert('User deleted successfully!');
      navigate('/user-management');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-management');
  };

  if (!isAdmin) {
    return <div className="error-state">Access denied. Admin privileges required.</div>;
  }

  if (loading) return <div className="loading-state">Loading user...</div>;
  if (error && !user) return <div className="error-state">{error}</div>;
  if (!user) return <div className="not-found-state">User not found</div>;

  return (
    <div className="edit-user-page">
      <div className="edit-user-header">
        <h2>Edit User</h2>
        <p>User ID: {user._id}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form className="user-edit-form" onSubmit={handleSave}>
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input 
                className="form-input"
                name="firstName" 
                value={form.firstName || ''} 
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input 
                className="form-input"
                name="lastName" 
                value={form.lastName || ''} 
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input 
                className="form-input"
                name="username" 
                value={form.username || ''} 
                onChange={handleChange} 
                required 
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input 
                className="form-input"
                type="email"
                name="email" 
                value={form.email || ''} 
                onChange={handleChange} 
                required 
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input 
                className="form-input"
                name="phone" 
                value={form.phone || ''} 
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select 
                className="form-select"
                name="department" 
                value={form.department || ''} 
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Engineering">Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Account Settings</h3>
          
          <div className="form-group">
            <label>Role *</label>
            <select 
              className="form-select"
              name="role" 
              value={form.role || ''} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
            <small className="form-help">
              User: Can create and view their own tickets<br/>
              Agent: Can view and manage tickets assigned to them<br/>
              Admin: Full access to all features and user management
            </small>
          </div>

          {currentUser._id === id && (
            <div className="warning-message">
              <strong>Warning:</strong> You are editing your own account. Be careful when changing your role or you may lose admin access.
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={handleDelete} 
            disabled={deleting || currentUser._id === id}
            title={currentUser._id === id ? "Cannot delete your own account" : "Delete user"}
          >
            {deleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit; 