import React, { useState } from 'react';
import './Login.css';  // Import the separate CSS for Login component

const Login = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    let formErrors = {};

    if (!username) {
      formErrors.username = 'Username is required';
    }

    if (!password) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Simulating successful login
      onSuccess(); // Trigger success callback passed from App.js
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
                        <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div>
          <label>Password:</label>
                        <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
