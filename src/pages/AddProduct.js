import React, { useState, useRef } from 'react';
import './AddProduct.css';
import AdminNavbar from './AdminNavbar';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    product_type: ''
  });
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const { brand, model_name, product_type } = formData;

    if (!brand || !model_name || !product_type || !file) {
      setError('❌ brand, model_name, product_type and image are all required');
      return;
    }

    try {
      const form = new FormData();
      form.append('brand', brand);
      form.append('model_name', model_name);
      form.append('product_type', product_type);
      form.append('image', file);

      const res = await fetch('https://backend-tawny-one-62.vercel.app/api/products', {
        method: 'POST',
        body: form
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || '❌ Failed to add product');
        return;
      }

      setSuccess('✅ Product added successfully!');
      setFormData({ brand: '', model_name: '', product_type: '' });
      setFile(null);
      window.dispatchEvent(new Event("product-added"));
    } catch (err) {
      console.error(err);
      setError('❌ Network error: ' + err.message);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="add-product-page">

        <div className="add-product-container">
          <h2 className="add-product-title">Add New Product</h2>
          {success && <div className="add-product-success-msg">{success}</div>}
          {error && <div className="add-product-error-msg">{error}</div>}

          <form className="add-product-form" onSubmit={handleSubmit}>
            <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
            <input type="text" name="model_name" placeholder="Model Name" value={formData.model_name} onChange={handleChange} required />
            <input type="text" name="product_type" placeholder="Product Type" value={formData.product_type} onChange={handleChange} required />

            <div className="add-product-upload-box" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current.click()}>
              {file ? file.name : 'Drag & drop image or click to upload'}
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} name="image" />
            </div>

            <button type="submit" className="add-product-submit-btn">Add Product</button>
          </form>

        </div>
      </div></div>
  );
};

export default AddProduct;
