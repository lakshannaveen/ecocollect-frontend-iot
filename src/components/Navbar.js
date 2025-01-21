import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">EcoCollect</div>
      <ul className="navbar-links">
        <li className="navbar-item"><a href="/bin-status">Bin Status</a></li>
        <li className="navbar-item"><a href="/bin-maps">Bin Maps</a></li>
        <li className="navbar-item"><a href="/analysis">Analysis</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
