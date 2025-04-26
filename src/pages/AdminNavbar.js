import React, { useState } from 'react';
import './Navbar.css';
import { FaChartPie, FaCog, FaSignOutAlt, FaBars, FaClipboardList } from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';

function AdminNavbar({ onLogoutClick }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <img src="/Images/logo.png" alt="logo" className="logo" />
        <div className="nav-links">
          <Link to="/overview" className={`nav-btn ${isActive('/overview') ? 'active' : ''}`}><FaChartPie /> Overview</Link>
          <Link to="/orders" className={`nav-btn ${isActive('/orders') ? 'active' : ''}`}><FaClipboardList /> Orders</Link>
          <Link to="/settings" className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}><FaCog /> Settings</Link>
          <a onClick={onLogoutClick} className="nav-btn"><FaSignOutAlt /> Logout</a>
        </div>
        <div className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <FaBars />
        </div>
      </nav>

      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/overview" className={`nav-btn ${isActive('/overview') ? 'active' : ''}`}><FaChartPie /> Overview</Link>
          <Link to="/orders" className={`nav-btn ${isActive('/orders') ? 'active' : ''}`}><FaClipboardList /> Orders</Link>
          <Link to="/settings" className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}><FaCog /> Settings</Link>
          <a onClick={onLogoutClick} className="nav-btn"><FaSignOutAlt /> Logout</a>
        </div>
      )}
    </>
  );
}

export default AdminNavbar;
