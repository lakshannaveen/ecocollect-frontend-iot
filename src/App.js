import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/Home';
import Map from './pages/Map';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Bin from './pages/Bin';

function App() {
  const location = useLocation(); // Get the current route path

  // Check if the current path is "/login"
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      {/* Conditionally render Navbar (hide it on the login page) */}
      {!isLoginPage && <Navbar />}

      <Routes>
        {/* Route for Login */}
        <Route
          path="/login"
          element={<Login onSuccess={() => window.location.href = '/home'} />}
        />

        {/* Route for Home page */}
        <Route path="/home" element={<Home />} />

        {/* Route for Bin Maps */}
        <Route path="/maps" element={<Map />} />
        <Route path="/bin" element={<Bin />} />

        {/* Default route (redirect to login if no matching route) */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
