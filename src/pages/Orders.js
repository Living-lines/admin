import React, { useEffect, useState } from 'react';
import './Orders.css';
import AdminNavbar from './AdminNavbar';

function Orders() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/quotes');
        if (!res.ok) {
          const err = await res.json();
          setError(`❌ Backend Error: ${err.error || 'Unknown error'}`);
          console.error('❌ Error response:', err);
          return;
        }

        const quotes = await res.json();
        console.log('✅ Quotes fetched:', quotes);

        const filtered = quotes.filter(q =>
          q.name && q.email && q.phone && q.product_name && q.image_url
        );

        const formatted = filtered.map((q, i) => ({
          id: i + 1,
          name: q.name,
          phone: q.phone,
          email: q.email,
          product: q.product_name,
          model: q.product_brand,
          product_type: q.product_type,
          image: q.image_url,

        })).reverse(); // ⬅️ Newest quotes appear first

        setData(formatted);
      } catch (err) {
        console.error('❌ Network error:', err);
        setError('❌ Failed to fetch quotes: ' + err.message);
      }
    };

    loadQuotes();
  }, []);

  return (
    <div className="orders-container">
      <AdminNavbar />
      <div className="orders-table-container">
        <h2 className="table-title">Order Details</h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <div className="glass-table">
          <table>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Product Type</th>
                {/*<th>Image</th> */}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.email}</td>
                    <td>{row.model}</td>
                    <td>{row.product}</td>
                    <td>{row.product_type}</td>
                    {/*<td>
                      <img
                        src={row.image}
                        alt={row.product}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No valid orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
