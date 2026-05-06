import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderDetailComponent from '../components/Order/OrderDetail';
import { getOrder } from '../api/order';
import { useAuth } from '../hooks/useAuth';

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getOrder(id)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Order not found');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Unauthorized');
        } else {
          setError('Failed to fetch order');
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="order-detail-page">
      <OrderDetailComponent order={order} />
    </div>
  );
}

export default OrderDetailPage;