// import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, isLoggedIn, onLogout }) {
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
            
            <Link className="nav-link px-3" to="/restaurants">
              <i className="bi bi-shop me-1"></i> Restaurants
            </Link>
            
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
