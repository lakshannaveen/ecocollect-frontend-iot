import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!username) formErrors.username = 'Username is required';
    if (!password) formErrors.password = 'Password is required';
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);

      try {
        const response = await axios.post(
          'http://localhost:5002/api/account/login',
          { username, password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setErrorMessage('');
          setSuccessMessage('Login successful!');
          setTimeout(() => {
            setLoading(false);
            onSuccess();
            navigate('/home');
          }, 2000);
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          setErrorMessage('Invalid username or password');
        } else {
          setErrorMessage('Something went wrong. Please try again later.');
        }
      }
    }
  };

  const handleQuickAccess = () => {
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={errors.username ? 'error-input' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errorMessage && <div className="error-banner">{errorMessage}</div>}
          {successMessage && <div className="success-banner">{successMessage}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button 
            type="button" 
            className="quick-access-button"
            onClick={handleQuickAccess}
          >
            Quick Access (Skip Login)
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Login;