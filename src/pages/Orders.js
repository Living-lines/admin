import React from 'react';
import './Orders.css';
import AdminNavbar from './AdminNavbar';

const data = [
  { id: 1, name: 'Ganesh', phone: '1234567890', email: 'ganesh@gmail.com', product: 'Sofa', model: 'X100' },
  { id: 2, name: 'Chandu', phone: '9876543210', email: 'chandu@gmail.com', product: 'Sink', model: 'L300' },
  { id: 3, name: 'Harsha', phone: '5556667777', email: 'harsha@gmail.com', product: 'Taps', model: 'T500' },
];

function Orders() {
  return (
    <div className="orders-container">
      <AdminNavbar />
      <div className="orders-table-container">
        <h2 className="table-title">Order Details</h2>
        <div className="glass-table">
          <table>
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Product Name</th>
                <th>Product Model</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.email}</td>
                  <td>{row.product}</td>
                  <td>{row.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
