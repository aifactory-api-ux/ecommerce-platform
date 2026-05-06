import React, { useState } from 'react';

function ProductForm({ initial, onSubmit, loading }) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [stock, setStock] = useState(initial?.stock || '');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setValidationError('Name is required');
      return;
    }
    if (!description) {
      setValidationError('Description is required');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      setValidationError('Valid price is required');
      return;
    }
    if (!stock || isNaN(parseInt(stock))) {
      setValidationError('Valid stock is required');
      return;
    }
    setValidationError('');
    onSubmit({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {validationError && <div className="validation-error">{validationError}</div>}
      <div className="form-field">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-field">
        <label>Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-field">
        <label>Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

export default ProductForm;