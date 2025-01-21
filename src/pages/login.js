import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import your CSS for styling
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let formErrors = {};
    if (!username) formErrors.username = 'Username is required';
    if (!password) formErrors.password = 'Password is required';
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(
          'http://localhost:5002/api/account/login',
          { username, password },
          { withCredentials: true } // Send cookies with request
        );
  
        if (response.status === 200) {
          Cookies.set('jwt', response.data.token, { expires: 7 }); // Store token in cookie
          navigate('/home'); // Redirect to home
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage('Invalid credentials'); // Invalid username or password
        } else {
          setErrorMessage('Something went wrong. Please try again later.');
        }
      }
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

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
