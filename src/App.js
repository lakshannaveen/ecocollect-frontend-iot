import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Corrected import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode JWT
        const currentTime = Date.now() / 1000; // Get current time in seconds
  
        if (decodedToken.exp < currentTime) {
          // If token is expired, remove it and update the state
          Cookies.remove('jwt');
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true); // User is logged in if token is valid
        }
      } catch (error) {
        console.error('Invalid token', error);
        Cookies.remove('jwt');
        setIsLoggedIn(false);
      }
    }
  }, []);
  

  // Handle logout: remove JWT and update state
  const handleLogout = () => {
    Cookies.remove('jwt'); // Remove JWT from cookies
    setIsLoggedIn(false); // Update state to log the user out
  };

  // Handle login success: update state to reflect login
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
