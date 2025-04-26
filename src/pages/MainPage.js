import React from 'react';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import './MainPage.css';
import './Footer.css';

function MainPage() {
  return (
    <div className="main-page">
      <AdminNavbar />

      <section className="hero-section">
        <div className="image-container">
          <img src="/Images/admin1.jpg" alt="Admin Image 1" className="image1" />
          <img src="/Images/admin3.jpg" alt="Admin Image 2" className="image2" />
        </div>

        <div className="text-container">
          <h1>Living Lines</h1>
          <p className="description-text">
            Living Lines Emporio is a venture of 'Living Lines Group', a synonym for high-end sanitary wares, bathroom fittings, tiles & allied building materials. Living Group had its inception in the year 1998 at Vizag in Andhra Pradesh, India.
          </p>
        </div>
      </section>
            <section className="cards-section">
        <div className="cards-container">

          <div className="card">
            <img src="/Images/piechart.jpg" alt="Pie Chart" className="card-image" />
            <div className="card-overlay">
              <button onClick={() => window.location.href = '/PieChart'} className="card-button">Pie Chart</button>
            </div>
          </div>

          <div className="card">
            <img src="/Images/datademo.jpg" alt="Data Demo" className="card-image" />
            <div className="card-overlay">
              <button onClick={() => window.location.href = '/DataDemonstration'} className="card-button">Demo</button>
            </div>
          </div>
          
          <div className="card">
            <img src="/Images/orders.jpg" alt="Orders" className="card-image" />
            <div className="card-overlay">
              <button onClick={() => window.location.href = '/Orders'} className="card-button">Orders</button>
            </div>
          </div>

        </div>
      </section>


      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default MainPage;
