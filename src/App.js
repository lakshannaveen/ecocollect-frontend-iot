import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/Home';
import Map from './pages/Map'; // Import the Map component
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Bin from './pages/Bin';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar displayed across all pages */}
        <Routes>
          {/* Route for Login */}
          <Route
            path="/login"
            element={<Login onSuccess={() => window.location.href = '/home'} />}
          />

          {/* Route for Home page */}
          <Route path="/home" element={<Home />} />

          {/* Route for Bin Maps */}
          <Route path="/maps" element={<Map />} /> {/* Map route */}
          <Route path="/bin" element={<Bin />} />

          {/* Default route (redirect to login if no matching route) */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
