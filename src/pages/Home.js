import React, { useState } from 'react';
import './Home.css';
import { FaMapMarkedAlt, FaChartLine, FaEnvelope, FaPhone } from 'react-icons/fa';

const Home = () => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="home-content">
          <h1 className="animated-heading">Welcome to Ecocollect</h1>
          <h2 className="subheading">IoT-based Smart Waste Collection and Tracking System</h2>
          
          <div className="quick-access">
            <button className="access-btn map-btn" onClick={() => window.location.href = '/maps'}>
              <FaMapMarkedAlt className="btn-icon" />
              <span>Map</span>
            </button>
            <button className="access-btn analysis-btn" onClick={() => window.location.href = '/analysis'}>
              <FaChartLine className="btn-icon" />
              <span>Analysis</span>
            </button>
            <button className="access-btn contact-btn" onClick={() => setShowContact(!showContact)}>
              <FaEnvelope className="btn-icon" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </div>

      {showContact && (
        <div className="contact-wrapper">
          <div className="contact-info animate-contact">
            <h3>Get in Touch</h3>
            <div className="contact-methods">
              <a href="tel:+1234567890" className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+1 (234) 567-890</span>
              </a>
              <a href="mailto:info@ecocollect.com" className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>info@ecocollect.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;