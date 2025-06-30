
import React, { useState, useRef, useEffect } from 'react';
import './AddProduct.css';
import AdminNavbar from './AdminNavbar';


const AddProduct = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    product_type: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [quotesError, setQuotesError] = useState('');
  const [products, setProducts] = useState([]);
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
    const { brand, model_name, product_type, description } = formData;
    if (!brand || !model_name || !product_type || !description || !file) {
      setError('❌ brand, model_name, product_type, desc and image are all required');
      return;
    }
    try {
      const form = new FormData();
      form.append('brand', brand);
      form.append('model_name', model_name);
      form.append('product_type', product_type);
      form.append('description', description);
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
      setFormData({ brand: '', model_name: '', product_type: '', description: ''});
      setFile(null);
      window.dispatchEvent(new Event("product-added"));
    } catch (err) {
      console.error(err);
      setError('❌ Network error: ' + err.message);
    }
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch('https://backend-tawny-one-62.vercel.app/api/quotes');
        if (!res.ok) {
          const err = await res.json();
          setQuotesError('❌ Failed to fetch quote requests: ' + (err.error || 'Unknown error'));
          return;
        }
        const quotesData = await res.json();
        const filtered = quotesData.filter(q =>
          q.name && q.email && q.phone && q.product_name && q.image_url
        );
        const formatted = filtered.map(q => ({
          name: q.name,
          phone: q.phone,
          email: q.email,
          brand: q.product_brand,
          model: q.product_name,
          product_type: q.product_type,
          image: q.image_url,
          recordId: q.id
        })).reverse();
        const withSerial = formatted.map((q, index) => ({
          ...q,
          serial: formatted.length - index
        }));
        setQuotes(withSerial);
      } catch (err) {
        console.error('❌ Error fetching quotes:', err);
        setQuotesError('❌ Failed to load quotes: ' + err.message);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://backend-tawny-one-62.vercel.app/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const productsData = await res.json();
        const filtered = productsData.filter(p => p.brand && p.model_name && p.product_type && p.image_url);
        setProducts(filtered);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };
    fetchProducts();
    window.addEventListener('product-added', fetchProducts);
    return () => window.removeEventListener('product-added', fetchProducts);
  }, []);

  const handleDelete = async (quoteId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this quote request?');
    if (!confirmDelete) return;
    try {
      const res = await fetch(`https://backend-tawny-one-62.vercel.app/api/quotes/${quoteId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setQuotesError('❌ Failed to delete quote: ' + (err.error || 'Unknown error'));
      } else {
        setQuotes(prevQuotes => {
          const updated = prevQuotes.filter(q => q.recordId !== quoteId);
          return updated.map((q, index) => ({ ...q, serial: index + 1 }));
        });
      }
    } catch (err) {
      console.error('❌ Network error during deletion:', err);
      setQuotesError('❌ Failed to delete quote: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`https://backend-tawny-one-62.vercel.app/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prevProducts =>
          prevProducts.filter(product => product.id !== productId)
        );
      } else {
        console.error('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
            <div className="add-product-upload-box" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current.click()}>
              {file ? file.name : 'Drag & drop image or click to upload'}
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} name="image" />
            </div>
            <button type="submit" className="add-product-submit-btn">Add Product</button>
          </form>
        </div>

        <div className="product-list-header">
          <h2 className="product-table-title">Product List</h2>
          <div id="poda">
            <div id="main">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  placeholder="Search..."
                  type="text"
                  className="input1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <div className="filterBorder"></div>
            </div>
          </div>

        </div>

        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Brand</th>
                <th>Model Name</th>
                <th>Product Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td><img src={product.image_url} alt={product.model_name} className="product-table-thumbnail" /></td>
                  <td>{product.brand}</td>
                  <td>{product.model_name}</td>
                  <td>{product.product_type}</td>
                  <td>
                    <button className="product-table-delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5">No products match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
