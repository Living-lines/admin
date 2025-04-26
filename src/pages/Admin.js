import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Login from './Login';
import './Admin.css';

const slideshowImages = [
  "/Images/slide1.jpg",
  "/Images/slide2.jpg",
  "/Images/slide3.jpg",
];

function Admin() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % slideshowImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <div className="slideshow-wrapper">
        <div
          className="slideshow-track"
          style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
        >
          {slideshowImages.map((src, index) => (
            <img key={index} src={src} alt={`slide-${index}`} />
          ))}
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Admin;
