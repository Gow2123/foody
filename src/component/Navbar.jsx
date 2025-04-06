// import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, isLoggedIn, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          Foody
        </Link>
        
        {/* Navbar toggler for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/restaurants">Restaurants</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/categories">Categories</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/all-products">Products</Link></li>
          </ul>
          
          <div className="d-flex">
            {/* Cart link */}
            <Link to="/cart" className="btn btn-outline-success me-2">
              Cart {cartCount > 0 && <span className="badge bg-success">{cartCount}</span>}
            </Link>
            
            {/* User account links */}
            {isLoggedIn ? (
              <>
                <Link to="/myorders" className="btn btn-outline-primary me-2">Orders</Link>
                <button onClick={onLogout} className="btn btn-outline-danger">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
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
