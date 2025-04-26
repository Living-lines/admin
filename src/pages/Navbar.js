import React, { useState } from 'react';
import './Navbar.css';
import { FaHome, FaCog, FaSignInAlt, FaBars } from 'react-icons/fa';

function Navbar({ onLoginClick }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <nav className="navbar">
        <img src="/Images/logo.png" alt="logo" className="logo" />
        <div className="nav-links">
          <a href="#" className="nav-btn"><FaHome /> Home</a>
          <a href="#" className="nav-btn"><FaCog /> Settings</a>
          <a onClick={onLoginClick} className="nav-btn"><FaSignInAlt /> Login</a>
        </div>
        <div className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <FaBars />
        </div>
      </nav>

      {showMobileMenu && (
        <div className="mobile-menu">
          <a href="#" className="nav-btn"><FaHome /> Home</a>
          <a href="#" className="nav-btn"><FaCog /> Settings</a>
          <a onClick={onLoginClick} className="nav-btn"><FaSignInAlt /> Login</a>
        </div>
      )}
    </>
  );
}

export default Navbar;
