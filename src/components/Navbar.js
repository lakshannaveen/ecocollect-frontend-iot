import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink instead of Link
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink 
          to="/home" 
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          EcoCollect
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li className="navbar-item">
          <NavLink 
            to="/bin" 
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Bin Status
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/maps" 
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Bin Maps
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink 
            to="/analysis" 
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Analysis
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
