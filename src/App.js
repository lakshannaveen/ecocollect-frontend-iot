import React from 'react';
import './App.css';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="App">
      {/* Include Navbar Component */}
      <Navbar />
      
      {/* Main Content */}
      <div className="content">
        <h1>Welcome to EcoCollect</h1>
        <p>IoT-based Smart Bin and Collection System</p>
      </div>
    </div>
  );
}

export default App;
