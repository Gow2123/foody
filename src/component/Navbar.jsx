// import React from 'react'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Determine backend URL based on environment
let backendUrl;
if (import.meta.env.VITE_BACKEND_URL) {
  backendUrl = import.meta.env.VITE_BACKEND_URL;
} else if (import.meta.env.DEV) {
  backendUrl = 'http://localhost:3000'; // Default for local development
} else {
  backendUrl = 'https://foody-backend0.vercel.app'; // Default for production build
}
const BACKEND_URL = backendUrl.replace(/\/$/, '');

function Navbar({ cartCount, isLoggedIn, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  
  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/products/categories`);
        if (response.ok) {
          const data = await response.json();
          // Get top 5 categories
          setCategories(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-egg-fried me-2"></i>FOODY
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">
              <i className="bi bi-house-door me-1"></i> Home
            </Link>
            
            <Link className="nav-link" to="/restaurants">
              <i className="bi bi-shop me-1"></i> Restaurants
            </Link>
            
            <div className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCategoriesDropdown(!showCategoriesDropdown);
                }}
              >
                <i className="bi bi-tags me-1"></i> Categories
              </a>
              <ul className={`dropdown-menu${showCategoriesDropdown ? ' show' : ''}`}>
                <li>
                  <Link className="dropdown-item" to="/categories">All Categories</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {categories.map(category => (
                  <li key={category._id}>
                    <Link 
                      className="dropdown-item" 
                      to={`/category/${category._id}`}
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link className="nav-link" to="/products">
              <i className="bi bi-grid me-1"></i> Menu
            </Link>
            
            <Link className="nav-link btn btn-warning text-dark px-3 mx-lg-2" to="/all-products">
              <i className="bi bi-search me-1"></i> All Products
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link className="nav-link" to="/myorders">
                  <i className="bi bi-bag-check me-1"></i> My Orders
                </Link>
                <Link className="nav-link position-relative" to="/cart">
                  <i className="bi bi-cart3"></i>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Link>
                <button
                  className="btn btn-sm btn-outline-light ms-2"
                  onClick={onLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                  <i className="bi bi-person me-1"></i> Login
                </Link>
                <Link className="nav-link btn btn-outline-light btn-sm ms-lg-2" to="/register">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  cartCount: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Navbar;
