import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set the login state to true after successful login
  };

  return (
    <Router>
      <div className="App">
        {/* Show Navbar only if logged in */}
        {isLoggedIn && <Navbar />}

        <Routes>
          {/* Route for Login */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/home" /> // Redirect to Home if already logged in
              ) : (
                <Login onSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Route for Home page */}
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
