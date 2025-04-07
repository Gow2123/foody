import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  // Sample cart items for demonstration
  const cartItems = [
    {
      id: 1,
      name: 'Cheeseburger Deluxe',
      price: 8.99,
      quantity: 2,
      restaurant: 'Burger Palace',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1470&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      price: 12.99,
      quantity: 1,
      restaurant: 'Pizza Heaven',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1470&auto=format&fit=crop'
    }
  ];

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="cart-page page-content">
      <div className="container">
        <div className="cart-header">
          <h1>My Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              <h2>Cart Items ({cartItems.length})</h2>
              
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="restaurant">{item.restaurant}</p>
                    <div className="item-price">${item.price.toFixed(2)}</div>
                  </div>
                  <div className="item-quantity">
                    <button className="quantity-btn">-</button>
                    <span>{item.quantity}</span>
                    <button className="quantity-btn">+</button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="remove-btn">×</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn">Proceed to Checkout</button>
              <Link to="/restaurants" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add items from restaurants to get started</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 