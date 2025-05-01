import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="signin-left">
          {/* Gradient sphere background will be added via CSS */}
        </div>
        <div className="signin-right">
          <div className="signin-form-container">
            <h1>Log In</h1>
            <p className="signin-subtitle">Welcome back! Please enter your details</p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Password
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <p className="password-hint">Use 8 or more characters with a mix of letters, numbers & symbols</p>
              </div>
              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="terms"
                    onChange={handleChange}
                    required
                  />
                  <span>Agree to our Terms of use and Privacy Policy</span>
                </label>
              </div>
              <div className="recaptcha-container">
                {/* Add reCAPTCHA component here */}
                <div className="recaptcha-placeholder">
                  I'm not a robot reCAPTCHA
                </div>
              </div>
              <button type="submit" className="signin-button">
                Log In
              </button>
              <p className="signup-link">
                Don't have an account? <a href="/signup">Request Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn; 