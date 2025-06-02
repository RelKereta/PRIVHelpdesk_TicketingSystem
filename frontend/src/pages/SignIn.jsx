import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './SignIn.css';
import eyeClosed from "../assets/eye00.png";
import eyeOpen from "../assets/eye01.png";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const role = user.role.toLowerCase();
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'agent') {
        navigate('/technician-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login({ email, password });
      // Only store the complete user object
      localStorage.setItem('user', JSON.stringify(response.user));
      
      const role = response.user.role.toLowerCase();
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'agent') {
        navigate('/technician-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.response?.data?.message || 'Failed to sign in');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              <img 
                src={showPassword ? eyeOpen : eyeClosed} 
                alt="toggle password visibility"
                className="eye-icon"
              />
            </button>
          </div>
        </div>
        <button type="submit" className="signin-button">
          Sign In
        </button>
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default SignIn; 