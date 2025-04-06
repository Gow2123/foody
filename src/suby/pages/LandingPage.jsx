import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

// Import feature icons
import featureIcon1 from '../assets/feature-icon-1.svg';
import featureIcon2 from '../assets/feature-icon-2.svg';
import featureIcon3 from '../assets/feature-icon-3.svg';

// Using web images
const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop";
const restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop";

const LandingPage = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious Food <span className="text-primary">Delivered</span> To Your Door
          </h1>
          <p className="hero-subtitle">
            Order from your favorite restaurants and enjoy mouthwatering meals without leaving home.
          </p>
          <div className="hero-actions">
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              Browse Restaurants
            </Link>
            {!isLoggedIn && (
              <Link to="/auth" className="btn btn-outline btn-lg">
                Sign Up Now
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">1000+</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">30min</span>
              <span className="stat-label">Avg. Delivery Time</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImage} alt="Delicious Food" className="hero-image" />
          <div className="hero-backdrop"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Foody</h2>
            <p className="section-subtitle">
              We make food ordering fast, simple and free - no matter if you order online or cash
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src={featureIcon1} alt="Quick Delivery" />
              </div>
              <h3 className="feature-title">Quick Delivery</h3>
              <p className="feature-description">
                We deliver your order promptly to your door at any time
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src={featureIcon2} alt="Best Quality" />
              </div>
              <h3 className="feature-title">Best Quality</h3>
              <p className="feature-description">
                We ensure our restaurants maintain high standards
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src={featureIcon3} alt="Easy Tracking" />
              </div>
              <h3 className="feature-title">Order Tracking</h3>
              <p className="feature-description">
                Track your order with real-time updates from restaurant to doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="restaurants-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Restaurants</h2>
            <p className="section-subtitle">
              Discover the most loved places with delicious food
            </p>
          </div>
          
          <div className="restaurants-preview">
            <img src={restaurantImage} alt="Popular Restaurants" className="restaurant-preview-image" />
            <div className="restaurant-preview-content">
              <h3>Hundreds of Flavors Under One Roof</h3>
              <p>
                From quick bites to gourmet meals, we have restaurants for every mood and occasion.
                Discover new flavors or enjoy your tried and true favorites.
              </p>
              <Link to="/restaurants" className="btn btn-primary">
                View All Restaurants
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to order your favorite food?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied customers who enjoy delicious meals delivered to their doorstep
            </p>
            <div className="cta-actions">
              {isLoggedIn ? (
                <Link to="/restaurants" className="btn btn-primary btn-lg">
                  Order Now
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">Foody</span>
              <p className="footer-tagline">Delicious food delivered</p>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>About</h4>
                <ul>
                  <li><Link to="/about">Our Story</Link></li>
                  <li><Link to="/team">Team</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Services</h4>
                <ul>
                  <li><Link to="/restaurants">Restaurants</Link></li>
                  <li><Link to="/delivery">Delivery</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Support</h4>
                <ul>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/help">Help Center</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">© {new Date().getFullYear()} Foody. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" className="social-link">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;