import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDeleteUser = async (userId, username) => {
    if (user._id === userId) {
      alert('You cannot delete your own account!');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      alert('User deleted successfully!');
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!isAdmin) {
    return <div className="error">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-management-container">
      <h1>User Management</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(userItem => (
            <tr key={userItem._id}>
              <td>{userItem.username}</td>
              <td>{userItem.email}</td>
              <td>
                <span className={`role-badge ${userItem.role}`}>
                  {userItem.role}
                </span>
              </td>
              <td>{userItem.department || 'N/A'}</td>
              <td>
                <button 
                  className="edit-btn"
                  onClick={() => handleEditUser(userItem._id)}
                  title="Edit user"
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(userItem._id, userItem.username)}
                  disabled={user._id === userItem._id}
                  title={user._id === userItem._id ? "Cannot delete your own account" : "Delete user"}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement; 