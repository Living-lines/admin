import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AddProduct.css';
import AdminNavbar from './AdminNavbar';

const AddProduct = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    product_type: '',
    description: '',
    tilestype: '',
    model_name: '',
    series: ''
  });
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const fileInputRef = useRef();
  const [productMode, setProductMode] = useState('other');
  const [tileTypes, setTileTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editFiles, setEditFiles] = useState([]);
  const editFileInputRef = useRef();
  const [editMode, setEditMode] = useState('other');
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    const loadTiles = async () => {
      try {
        const r1 = await fetch('https://backend-tawny-one-62.vercel.app/api/products/tilestypes');
        const d1 = await r1.json();
        let tiles = Array.isArray(d1) ? d1 : (Array.isArray(d1.records) ? d1.records.map(x => x.name || x.tilestype).filter(Boolean) : []);
        if (!tiles.length) {
          const r2 = await fetch('https://backend-tawny-one-62.vercel.app/api/tilestype');
          const d2 = await r2.json();
          tiles = Array.isArray(d2) ? d2 : (Array.isArray(d2.records) ? d2.records.map(x => x.name || x.tilestype).filter(Boolean) : []);
        }
        setTileTypes([...new Set(tiles)]);
      } catch {
        setTileTypes([]);
      }
    };
    loadTiles();
  }, []);

  const handleFileSelect = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('https://backend-tawny-one-62.vercel.app/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const productsData = await res.json();
      const filtered = productsData.filter(p =>
        p.brand &&
        p.product_type &&
        ((Array.isArray(p.images) && p.images.length > 0) || p.image_url)
      );
      setProducts(filtered);
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSuccess('');
    setError('');
    const { brand, product_type, description } = formData;
    if (!brand || !product_type || files.length === 0) {
      setError('❌ brand, product_type and at least one image are required');
      return;
    }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append('brand', brand);
      form.append('product_type', product_type);
      form.append('description', description);
      if (formData.model_name) form.append('model_name', formData.model_name);
      if (formData.series) form.append('series', formData.series);
      files.forEach((f) => form.append('images', f));
      if (product_mode_is_tiles(productMode, product_type)) {
        form.append('tilestype', formData.tilestype);
      }
      const res = await fetch('https://backend-tawny-one-62.vercel.app/api/products', {
        method: 'POST',
        body: form
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || '❌ Failed to add product');
        setIsSubmitting(false);
        return;
      }
      const created = await res.json();
      setSuccess('✅ Product added successfully!');
      setFormData({ brand: '', product_type: '', description: '', tilestype: '', model_name: '', series: '' });
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setProducts(prev => [created, ...prev]);
      window.dispatchEvent(new Event('product-added'));
      await fetchProducts();
    } catch (err) {
      setError('❌ Network error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const product_mode_is_tiles = (mode, type) => mode === 'tiles' || type === 'Tiles';

  useEffect(() => {
    fetchProducts();
    const h = () => fetchProducts();
    window.addEventListener('product-added', h);
    return () => window.removeEventListener('product-added', h);
  }, [fetchProducts]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`https://backend-tawny-one-62.vercel.app/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prevProducts =>
          prevProducts.filter(product => product.id !== productId)
        );
      }
    } catch {}
  };

  const openEdit = (product) => {
    setEditData({
      id: product.id,
      brand: product.brand || '',
      product_type: product.product_type || '',
      description: product.description || '',
      tilestype: product.tilestype || '',
      model_name: product.model_name || '',
      series: product.series || ''
    });
    setEditMode(product.product_type === 'Tiles' ? 'tiles' : 'other');
    setEditFiles([]);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileSelect = (e) => {
    const picked = Array.from(e.target.files || []);
    setEditFiles(prev => [...prev, ...picked]);
  };

  const handleEditDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setEditFiles(prev => [...prev, ...dropped]);
  };

  const submitEdit = async () => {
    if (!editData || isEditingSubmitting) return;
    setIsEditingSubmitting(true);
    const id = editData.id;
    const form = new FormData();
    if (editData.brand) form.append('brand', editData.brand);
    if (editData.product_type) form.append('product_type', editData.product_type);
    if (editData.description !== undefined) form.append('description', editData.description);
    if (editData.model_name) form.append('model_name', editData.model_name);
    if (editData.series) form.append('series', editData.series);
    if ((editMode === 'tiles' || editData.product_type === 'Tiles') && editData.tilestype) {
      form.append('tilestype', editData.tilestype);
    }
    editFiles.forEach(f => form.append('images', f));
    try {
      const res = await fetch(`https://backend-tawny-one-62.vercel.app/api/products/${id}`, {
        method: 'PUT',
        body: form
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to update product');
        setIsEditingSubmitting(false);
        return;
      }
      const updated = await res.json();
      setProducts(prev =>
        prev.map(p => {
          const isTarget = p.id === id || p.id === updated.id;
          if (!isTarget) return p;
          const merged = { ...p, ...updated };
          if ((!updated.images || updated.images.length === 0) && Array.isArray(p.images)) {
            merged.images = p.images;
          }
          if (!merged.image_url && p.image_url) {
            merged.image_url = p.image_url;
          }
          return merged;
        })
      );
      await fetchProducts();
      setShowEdit(false);
      setEditData(null);
      setEditFiles([]);
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    } catch {
      alert('Network error while updating');
    } finally {
      setIsEditingSubmitting(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const q = (searchTerm || '').toLowerCase();
    if (!q) return true;
    const brand = product.brand?.toLowerCase() || '';
    const type  = product.product_type?.toLowerCase() || '';
    const desc  = product.description?.toLowerCase() || '';
    const model = product.model_name?.toLowerCase() || '';
    const series = product.series?.toLowerCase() || '';
    return brand.includes(q) || type.includes(q) || desc.includes(q) || model.includes(q) || series.includes(q);
  });

  return (
    <div>
      <AdminNavbar />
      <div className="add-product-page-final">
        <div className="add-product-container-final">
          <h3 className="add-product-title-final">Add New Product</h3>
          {success && <div className="add-product-success-msg-final">{success}</div>}
          {error && <div className="add-product-error-msg-final">{error}</div>}

          <div className="product-mode-selection-final">
            <label className="radio-label-final">
              <input
                type="radio"
                name="productMode"
                value="tiles"
                checked={productMode === 'tiles'}
                onChange={() => {
                  setProductMode('tiles');
                  setFormData(prev => ({ ...prev, product_type: 'Tiles', tilestype: '' }));
                }}
              />
              <span>Tiles</span>
            </label>
            <label className="radio-label-final">
              <input
                type="radio"
                name="productMode"
                value="other"
                checked={productMode === 'other'}
                onChange={() => {
                  setProductMode('other');
                  setFormData(prev => ({ ...prev, product_type: '', tilestype: '' }));
                }}
              />
              <span>Other Products</span>
            </label>
          </div>

          <form className="add-product-form-final" onSubmit={handleSubmit}>
            <div className="form-row-final">
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="input-final"
              />
            </div>

            {productMode === 'tiles' ? (
              <div className="form-row-final">
                <select
                  name="tilestype"
                  value={formData.tilestype}
                  onChange={handleChange}
                  required
                  className="select-final"
                >
                  <option value="">Select Tile Category</option>
                  {tileTypes.map(tile => (
                    <option key={tile} value={tile}>{tile}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-row-final">
                <input
                  type="text"
                  name="product_type"
                  placeholder="Product Type"
                  value={formData.product_type}
                  onChange={handleChange}
                  required
                  className="input-final"
                />
              </div>
            )}

            {productMode !== 'tiles' && (
              <div className="form-row-final">
                <input
                  type="text"
                  name="model_name"
                  placeholder="Model"
                  value={formData.model_name}
                  onChange={handleChange}
                  className="input-final"
                />
              </div>
            )}

            <div className="form-row-final">
              <input
                type="text"
                name="series"
                placeholder="Series (optional)"
                value={formData.series}
                onChange={handleChange}
                className="input-final"
              />
            </div>

            <div className="form-row-final">
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="textarea-final"
              />
            </div>

            <div
              className="upload-box-final"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
            >
              <span>{files.length ? `${files.length} image(s) selected` : 'Drag & drop image(s) or click to upload'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                name="images"
                className="hidden-file-input-final"
              />
              {files.length > 0 && (
                <div className="selected-files-list-final">
                  {files.map((f, i) => (
                    <div key={i} className="selected-file-item-final">
                      <span>{f.name}</span>
                      <button
                        type="button"
                        className="chip-close-final"
                        onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter((_, idx) => idx !== i)); }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions-final">
              <button type="submit" className="primary-btn-final" disabled={isSubmitting}>
                {isSubmitting ? 'Adding…' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>

        <div className="product-list-wrap-final">
          <div className="page-header-final">
            <h2 className="page-title-final">Products</h2>
            <div className="header-search-final">
              <input
                placeholder="Search..."
                type="text"
                className="search-input-final"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="product-table-container-final">
            <table className="product-table-final">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Brand</th>
                  <th>Product Type</th>
                  <th>Model</th>
                  <th>Series</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={
                          (Array.isArray(product.images) && product.images[0]) ||
                          product.image_url ||
                          ''
                        }
                        alt={product.brand || 'Product'}
                        className="product-table-thumbnail-final"
                      />
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.product_type}</td>
                    <td>{product.model_name || ''}</td>
                    <td>{product.series || ''}</td>
                    <td>
                      <div className="product-table-actions-final">
                        <button className="edit-btn-final" onClick={() => openEdit(product)}>Edit</button>
                        <button className="delete-btn-final" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data-final">No products match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && editData && (
        <div className="modal-overlay-final" onClick={() => setShowEdit(false)}>
          <div className="modal-content-final" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-final" onClick={() => setShowEdit(false)} aria-label="Close">×</button>
            <h3 className="modal-title-final">Edit Product</h3>

            <div className="radio-row-final">
              <label className="radio-label-final">
                <input
                  type="radio"
                  name="editMode"
                  value="tiles"
                  checked={editMode === 'tiles'}
                  onChange={() => setEditMode('tiles')}
                />
                <span>Tiles</span>
              </label>
              <label className="radio-label-final">
                <input
                  type="radio"
                  name="editMode"
                  value="other"
                  checked={editMode === 'other'}
                  onChange={() => setEditMode('other')}
                />
                <span>Other Products</span>
              </label>
            </div>

            <div className="edit-form-final">
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={editData.brand}
                onChange={handleEditChange}
                className="input-final"
              />
              {editMode === 'tiles' ? (
                <>
                  <input
                    type="text"
                    name="product_type"
                    value="Tiles"
                    readOnly
                    className="input-final read-only-final"
                  />
                  <select
                    name="tilestype"
                    value={editData.tilestype || ''}
                    onChange={handleEditChange}
                    className="select-final"
                  >
                    <option value="">Select Tile Category</option>
                    {tileTypes.map(tile => (
                      <option key={tile} value={tile}>{tile}</option>
                    ))}
                  </select>
                </>
              ) : (
                <input
                  type="text"
                  name="product_type"
                  placeholder="Product Type"
                  value={editData.product_type}
                  onChange={handleEditChange}
                  className="input-final"
                />
              )}
              {editMode !== 'tiles' && (
                <input
                  type="text"
                  name="model_name"
                  placeholder="Model"
                  value={editData.model_name || ''}
                  onChange={handleEditChange}
                  className="input-final"
                />
              )}
              <input
                type="text"
                name="series"
                placeholder="Series"
                value={editData.series || ''}
                onChange={handleEditChange}
                className="input-final"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editData.description || ''}
                onChange={handleEditChange}
                rows={4}
                className="textarea-final"
              />

              <div
                className="edit-upload-box-final"
                onDrop={handleEditDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => editFileInputRef.current.click()}
              >
                <span>{editFiles.length ? `${editFiles.length} new image(s) selected` : 'Drag & drop image(s) or click to upload (leave empty to keep existing)'}</span>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditFileSelect}
                  name="images"
                  className="hidden-file-input-final"
                />
                {editFiles.length > 0 && (
                  <div className="selected-files-list-final">
                    {editFiles.map((f, i) => (
                      <div key={i} className="selected-file-item-final">
                        <span>{f.name}</span>
                        <button
                          type="button"
                          className="chip-close-final"
                          onClick={(e) => { e.stopPropagation(); setEditFiles(prev => prev.filter((_, idx) => idx !== i)); }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions-final">
              <button className="secondary-btn-final" onClick={() => setShowEdit(false)} disabled={isEditingSubmitting}>Cancel</button>
              <button
                className="primary-btn-final"
                disabled={isEditingSubmitting}
                onClick={() => {
                  const pt = editMode === 'tiles' ? 'Tiles' : editData.product_type;
                  setEditData(prev => ({ ...prev, product_type: pt }));
                  submitEdit();
                }}
              >
                {isEditingSubmitting ? 'Updating…' : 'Confirm Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
