import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

// Using web image for logo
const foodIcon = "https://img.icons8.com/external-vitaliy-gorbachev-flat-vitaly-gorbachev/2x/external-burger-fast-food-vitaliy-gorbachev-flat-vitaly-gorbachev.png";

const NavBar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogin = () => {
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <img src={foodIcon} alt="Food Logo" className="food-icon" />
          </div>
          <span className="logo-text">Foody</span>
        </Link>

        <div className="navbar-right">
          <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li className={location.pathname === '/restaurants' ? 'active' : ''}>
              <Link to="/restaurants" onClick={() => setMobileMenuOpen(false)}>Restaurants</Link>
            </li>
            <li className={location.pathname === '/menu' ? 'active' : ''}>
              <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className={location.pathname === '/cart' ? 'active' : ''}>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <span className="nav-icon">🛒</span>
                    My Cart
                  </Link>
                </li>
                <li className={location.pathname === '/orders' ? 'active' : ''}>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                    <span className="nav-icon">📋</span>
                    My Orders
                  </Link>
                </li>
              </>
            )}
            <li className={location.pathname === '/about' ? 'active' : ''}>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            </li>
            <li className={location.pathname === '/contact' ? 'active' : ''}>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </li>
          </ul>

          <div className="navbar-auth">
            {isLoggedIn ? (
              <div className="user-dropdown">
                <div className="user-info" onClick={toggleDropdown}>
                  <div className="user-avatar">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="user-name">{user?.username || 'User'}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">👤</span> My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">📋</span> My Orders
                  </Link>
                  <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">🛒</span> My Cart
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span className="dropdown-icon">🚪</span> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-login">
                <span>Login</span> / <span>Sign Up</span>
              </button>
            )}
          </div>

          <div className="mobile-toggle" onClick={toggleMobileMenu}>
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 