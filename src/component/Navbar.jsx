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
  const [restaurants, setRestaurants] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showRestaurantsDropdown, setShowRestaurantsDropdown] = useState(false);
  
  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/categories/featured`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch featured restaurants for the dropdown
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/restaurants/featured`);
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    
    fetchCategories();
    fetchRestaurants();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowCategoriesDropdown(false);
      setShowRestaurantsDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent dropdown from closing when clicking inside it
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

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
          <div className="navbar-nav mx-auto">
            <Link className="nav-link px-3" to="/">
              <i className="bi bi-house-door me-1"></i> Home
            </Link>
            
            {/* Restaurants Dropdown */}
            <div className="nav-item dropdown" onClick={handleDropdownClick}>
              <a 
                className="nav-link dropdown-toggle px-3" 
                href="#" 
                role="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowRestaurantsDropdown(!showRestaurantsDropdown);
                  setShowCategoriesDropdown(false);
                }}
              >
                <i className="bi bi-shop me-1"></i> Restaurants
              </a>
              <ul className={`dropdown-menu${showRestaurantsDropdown ? ' show' : ''}`}>
                <li>
                  <Link className="dropdown-item" to="/restaurants">
                    <i className="bi bi-grid-3x3-gap me-2"></i>All Restaurants
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li className="dropdown-header">Featured Restaurants</li>
                {restaurants.map(restaurant => (
                  <li key={restaurant._id}>
                    <Link 
                      className="dropdown-item" 
                      to={`/restaurant/${restaurant._id}`}
                      onClick={() => setShowRestaurantsDropdown(false)}
                    >
                      <i className="bi bi-star-fill me-2 text-warning small"></i>
                      {restaurant.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Categories Dropdown */}
            <div className="nav-item dropdown" onClick={handleDropdownClick}>
              <a 
                className="nav-link dropdown-toggle px-3" 
                href="#" 
                role="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowCategoriesDropdown(!showCategoriesDropdown);
                  setShowRestaurantsDropdown(false);
                }}
              >
                <i className="bi bi-tags me-1"></i> Categories
              </a>
              <ul className={`dropdown-menu${showCategoriesDropdown ? ' show' : ''}`}>
                <li>
                  <Link className="dropdown-item" to="/categories">
                    <i className="bi bi-grid-3x3-gap me-2"></i>All Categories
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li className="dropdown-header">Popular Categories</li>
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
            
            <Link className="nav-link px-3" to="/products">
              <i className="bi bi-grid me-1"></i> Menu
            </Link>
            
            <Link className="nav-link px-3" to="/all-products">
              <i className="bi bi-search me-1"></i> Browse All
            </Link>
          </div>

          <div className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <Link className="nav-link px-3" to="/myorders">
                  <i className="bi bi-bag-check me-1"></i> My Orders
                </Link>
                <Link className="nav-link position-relative px-3" to="/cart">
                  <i className="bi bi-cart3 fs-5"></i>
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
                <Link className="nav-link px-3" to="/login">
                  <i className="bi bi-person me-1"></i> Login
                </Link>
                <Link className="nav-link btn btn-light text-success btn-sm ms-lg-2 px-3" to="/register">
                  <i className="bi bi-person-plus me-1"></i> Sign Up
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
