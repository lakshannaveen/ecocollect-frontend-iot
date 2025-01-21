import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check if JWT exists in cookies on component mount
  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsLoggedIn(true); // User is logged in if a valid token exists
    }
  }, []);

  // Handle logout: remove JWT and update state
  const handleLogout = () => {
    Cookies.remove('jwt'); // Remove JWT from cookies
    setIsLoggedIn(false); // Update state to log the user out
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update state to show navbar and home page
  };

  return (
    <Router>
      <div className="App">
        {/* Only show Navbar if user is logged in */}
        {isLoggedIn && <Navbar onLogout={handleLogout} />}

        <Routes>
          {/* Route for Login */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <Login onSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Route for Home, redirects to login if not logged in */}
          <Route
            path="/home"
            element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Default Route (Redirect to Login if none of the above matched) */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
