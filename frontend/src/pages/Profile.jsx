import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/signin');
        return;
      }
      setProfile(user);
      setEditedProfile(user);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updateUser(profile._id, editedProfile);
      setProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading-state">Loading profile...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!profile) return <div className="not-found-state">Profile not found</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-container">
        {/* Profile Picture Section */}
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <div className="avatar-circle">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" />
              ) : (
                <span className="avatar-initials">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              )}
            </div>
            {isEditing && (
              <button className="change-avatar-btn">
                Change Photo
              </button>
            )}
          </div>
          <div className="profile-status">
            <div className="status-indicator online"></div>
            <span>Online</span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-info-section">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button className="edit-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{profile.firstName}</p>
                )}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{profile.lastName}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{profile.email}</p>
                )}
              </div>
              <div className="form-group">
                <label>Department</label>
                {isEditing ? (
                  <select
                    value={editedProfile.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="form-input"
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="form-value">{profile.department}</p>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="form-textarea"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="form-value">{profile.bio || 'No bio provided'}</p>
              )}
            </div>

            <div className="form-group full-width">
              <label>Member Since</label>
              <p className="form-value">{formatDate(profile.joinDate)}</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="profile-stats-section">
          <h3>Activity Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{profile.createdTickets?.length || 0}</div>
              <div className="stat-label">Tickets Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{profile.assignedTickets?.length || 0}</div>
              <div className="stat-label">Tickets Assigned</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{profile.role}</div>
              <div className="stat-label">Role</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{profile.department}</div>
              <div className="stat-label">Department</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 