import React from 'react';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import './Overview.css';
import AdminNavbar from './AdminNavbar';

const pieData = [
  { name: 'Customers', value: 240 },
  { name: 'Requests', value: 150 },
];

const barData = [
  { name: 'Sinks', requests: 40 },
  { name: 'Interior', requests: 30 },
  { name: 'Taps', requests: 20 },
  { name: 'Cammod', requests: 27 },
];

const tableData = [
  { id: 1, name: 'Ganesh', phone: '1234567890', product: 'Interior', model: 'XL100' },
  { id: 2, name: 'Chandu', phone: '0987654321', product: 'Sinks', model: 'ML200' },
  { id: 3, name: 'Harsha', phone: '9876543210', product: 'Taps', model: 'NH300' },
];

const COLORS = ['#ff6b6b', '#4dabf7'];

function Overview() {
  return (
    <div className="main-page">
      <AdminNavbar />
    
    <div className="overview-container">
      <section className="section-card">
        <h2 className="section-heading">Overview Analytics</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={200} innerRadius={120}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <p><span style={{ backgroundColor: COLORS[0] }}></span> Customers</p>
            <p><span style={{ backgroundColor: COLORS[1] }}></span> Requests</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-heading">Top Requested Products</h2>
        <div className="chart-wrapper2">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ReTooltip />
              <Legend />
              <Bar dataKey="requests" fill="#845ef7" />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <p><span style={{ backgroundColor: '#845ef7' }}></span> Requests</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-heading">Customer Requests Table</h2>
        <div className="table-wrapper">
          <table className="overview-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Model</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.product}</td>
                  <td>{row.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </div>
  );
}

export default Overview;
