import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import MainPage from "./pages/MainPage";
import PieChart from './pages/PieChart';
import DataDemonstration from './pages/DataDemonstration';
import Orders from './pages/Orders';
import AddCatalog from './pages/AddCatalog';
import AddProduct from './pages/AddProduct';
import Overview from './pages/Overview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/PieChart" element={<PieChart />} />
        <Route path="/DataDemonstration" element={<DataDemonstration />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/add-catalog" element={<AddCatalog />} />

        <Route path="/add-product" element={<AddProduct />} />

      </Routes>
    </Router>
  );
}

export default App;
