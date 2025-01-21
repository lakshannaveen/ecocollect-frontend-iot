import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/login';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Login */}
          <Route
            path="/login"
            element={<Login onSuccess={() => window.location.href = '/home'} />}
          />

          {/* Route for Home page */}
          <Route
            path="/home"
            element={
              <>
                <Navbar /> {/* Only show Navbar on Home page */}
                <Home />
              </>
            }
          />

          {/* Default route (redirect to login if no matching route) */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
