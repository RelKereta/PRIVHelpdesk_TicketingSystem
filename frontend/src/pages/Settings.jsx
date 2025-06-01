import React, { useState } from 'react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    theme: 'light',
    language: 'en',
    ticketSettings: {
      autoAssign: true,
      priorityEscalation: true,
      responseTime: '24'
    },
    privacy: {
      profileVisibility: 'team',
      activityStatus: true
    }
  });

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and system configurations</p>
      </div>

      <div className="settings-container">
        {/* Notifications Settings */}
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              <span>Email notifications</span>
            </label>
            <p className="setting-description">Receive ticket updates via email</p>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleNotificationChange('push')}
              />
              <span>Push notifications</span>
            </label>
            <p className="setting-description">Receive instant notifications in browser</p>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={() => handleNotificationChange('sms')}
              />
              <span>SMS notifications</span>
            </label>
            <p className="setting-description">Receive urgent ticket notifications via SMS</p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label className="setting-label">
              <span>Theme</span>
              <select
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                className="setting-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </label>
            <p className="setting-description">Choose your preferred theme</p>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <span>Language</span>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="setting-select"
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="es">Español</option>
              </select>
            </label>
            <p className="setting-description">Select your preferred language</p>
          </div>
        </div>

        {/* Ticket Settings */}
        <div className="settings-section">
          <h3>Ticket Management</h3>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.ticketSettings.autoAssign}
                onChange={() => handleSettingChange('ticketSettings', 'autoAssign', !settings.ticketSettings.autoAssign)}
              />
              <span>Auto-assign tickets</span>
            </label>
            <p className="setting-description">Automatically assign new tickets to available agents</p>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.ticketSettings.priorityEscalation}
                onChange={() => handleSettingChange('ticketSettings', 'priorityEscalation', !settings.ticketSettings.priorityEscalation)}
              />
              <span>Priority escalation</span>
            </label>
            <p className="setting-description">Automatically escalate high-priority tickets</p>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <span>Default response time (hours)</span>
              <select
                value={settings.ticketSettings.responseTime}
                onChange={(e) => handleSettingChange('ticketSettings', 'responseTime', e.target.value)}
                className="setting-select"
              >
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
            </label>
            <p className="setting-description">Set default response time for new tickets</p>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <h3>Privacy & Security</h3>
          <div className="setting-item">
            <label className="setting-label">
              <span>Profile visibility</span>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                className="setting-select"
              >
                <option value="public">Public</option>
                <option value="team">Team only</option>
                <option value="private">Private</option>
              </select>
            </label>
            <p className="setting-description">Control who can see your profile information</p>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.privacy.activityStatus}
                onChange={() => handleSettingChange('privacy', 'activityStatus', !settings.privacy.activityStatus)}
              />
              <span>Show activity status</span>
            </label>
            <p className="setting-description">Show when you're online to team members</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="btn-save" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-reset" onClick={() => window.location.reload()}>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings; 