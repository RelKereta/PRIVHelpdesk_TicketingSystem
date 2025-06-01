import React, { useState } from 'react';
import './Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Random',
    lastName: 'Name',
    email: 'random.name@priv.com',
    position: 'Senior Creative Director',
    department: 'Design',
    phone: '+62 812-3456-7890',
    bio: 'Experienced creative director with 8+ years in the industry. Passionate about innovative design solutions and leading high-performing teams.',
    location: 'Jakarta, Indonesia',
    joinDate: '2020-03-15',
    avatar: null
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically save to backend
    alert('Profile updated successfully!');
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
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" />
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
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{profile.position}</p>
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
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Support">Support</option>
                    <option value="HR">Human Resources</option>
                  </select>
                ) : (
                  <p className="form-value">{profile.department}</p>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{profile.location}</p>
              )}
            </div>

            <div className="form-group full-width">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="form-textarea"
                  rows="3"
                />
              ) : (
                <p className="form-value">{profile.bio}</p>
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
              <div className="stat-number">24</div>
              <div className="stat-label">Tickets Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">18</div>
              <div className="stat-label">Tickets Resolved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">6</div>
              <div className="stat-label">Active Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.8</div>
              <div className="stat-label">Avg. Response (hrs)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 