// import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, isLoggedIn, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand custom-navbar-brand" to="/">
          Foody
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/restaurants">Restaurants</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">Categories</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/myorders">My Orders</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <Link to="/cart" className="button button-outline me-2">
              Cart ({cartCount})
            </Link>
            {isLoggedIn ? (
              <button onClick={onLogout} className="button">
                Logout
              </button>
            ) : (
              <Link to="/login" className="button">
                Login
              </Link>
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
