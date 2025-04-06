import React from 'react';
import { Link } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
  // Sample orders for demonstration
  const orders = [
    {
      id: 'ORD-12345',
      date: '2025-04-05T18:30:00',
      restaurant: 'Burger Palace',
      items: [
        { name: 'Cheeseburger Deluxe', quantity: 2, price: 8.99 },
        { name: 'French Fries', quantity: 1, price: 3.49 }
      ],
      total: 21.47,
      status: 'Delivered',
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001'
    },
    {
      id: 'ORD-12346',
      date: '2025-04-02T19:15:00',
      restaurant: 'Pizza Heaven',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Garlic Bread', quantity: 1, price: 4.99 }
      ],
      total: 17.98,
      status: 'Delivered',
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001'
    },
    {
      id: 'ORD-12347',
      date: '2025-04-06T12:45:00',
      restaurant: 'Sushi World',
      items: [
        { name: 'California Roll', quantity: 2, price: 9.99 },
        { name: 'Miso Soup', quantity: 1, price: 3.49 }
      ],
      total: 23.47,
      status: 'Processing',
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001'
    }
  ];

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="orders-page page-content">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>View and track your order history</p>
        </div>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">{formatDate(order.date)}</span>
                  </div>
                  <div className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="order-restaurant">
                  <h3>{order.restaurant}</h3>
                </div>
                
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-name">
                        <span className="quantity">{item.quantity}x</span> {item.name}
                      </div>
                      <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="order-actions">
                    <button className="btn-reorder">Reorder</button>
                    <Link to={`/orders/${order.id}`} className="btn-details">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-orders-icon">📋</div>
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 