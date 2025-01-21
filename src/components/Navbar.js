import React from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">EcoCollect</Link> {/* Add Link to home page */}
      </div>
      <ul className="navbar-links">
        <li className="navbar-item"><Link to="/bin-status">Bin Status</Link></li>
        <li className="navbar-item"><Link to="/maps">Bin Maps</Link></li> {/* Navigate to Map */}
        <li className="navbar-item"><Link to="/analysis">Analysis</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
