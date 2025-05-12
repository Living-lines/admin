import React, { useState } from 'react';
import './Navbar.css';
import {
  FaChartPie, FaSignOutAlt, FaBars,
  FaClipboardList, FaFilePdf, FaPlusSquare
} from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';

function AdminNavbar({ onLogoutClick }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    //{ path: '/overview', label: 'Overview', icon: <FaChartPie /> },
    { path: '/orders', label: 'Orders', icon: <FaClipboardList /> },
    { path: '/add-product', label: 'Add Product', icon: <FaPlusSquare /> },
    { path: '/add-catalog', label: 'Add Catalog', icon: <FaFilePdf /> }
  ];

  return (
    <>
      <nav className="navbar">
        <img src="/Images/logo.png" alt="logo" className="logo" />
        <div className="nav-links">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          {/*<span onClick={onLogoutClick} className="nav-btn logout-btn">
            <FaSignOutAlt /> Logout
          </span> */}
        </div>
        <div className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <FaBars />
        </div>
      </nav>

      {showMobileMenu && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}{/*
          <span onClick={onLogoutClick} className="nav-btn logout-btn">
            <FaSignOutAlt /> Logout
          </span> */}
        </div>
      )}
    </>
  );
}

export default AdminNavbar;
