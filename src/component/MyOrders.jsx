// MyOrders component for displaying and tracking orders

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../config';

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Remove the deleted order from state
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">You haven&apos;t placed any orders yet.</p>
          <button className="btn btn-danger" onClick={() => navigate('/')}>
            Start Ordering
          </button>
        </div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order #{order._id.slice(-6)}</h5>
                  <span className={`badge bg-${order.status === 'delivered' ? 'success' : 'warning'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6>Delivery Address</h6>
                    <p className="mb-0">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6>Items</h6>
                    {order.items.map(item => (
                      <div key={item._id || item.product} className="d-flex align-items-center border-bottom py-2">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name || 'Product'} 
                            className="me-3" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{item.name || (item.product && item.product.name)} x {item.quantity}</span>
                            <span>${((item.price || (item.product && item.product.price) || 0) * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Total Amount</strong>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small>Ordered on {new Date(order.createdAt).toLocaleDateString()}</small>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;