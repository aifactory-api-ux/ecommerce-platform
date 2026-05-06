import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';

function OrderForm({ onSubmit, loading }) {
  const { products, fetchProducts } = useProducts();
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [validationError, setValidationError] = useState('');

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'product_id' ? parseInt(value) || '' : parseInt(value) || 1;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validItems = items.filter((item) => item.product_id && item.quantity > 0);
    if (validItems.length === 0) {
      setValidationError('At least one item is required');
      return;
    }
    setValidationError('');
    onSubmit({ items: validItems });
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {validationError && <div className="validation-error">{validationError}</div>}
      <h3>Order Items</h3>
      {items.map((item, index) => (
        <div key={index} className="order-item-row">
          <select
            value={item.product_id}
            onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
            disabled={loading}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            disabled={loading}
          />
          <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddItem}>Add Item</button>
      <button type="submit" disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}

export default OrderForm;