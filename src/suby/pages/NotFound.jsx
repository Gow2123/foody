import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

// Import food emoji SVG
import notFoundImage from '../assets/not-found.svg';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-image">
          <img src={notFoundImage} alt="Page not found" />
        </div>
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
          <Link to="/restaurants" className="btn btn-outline">Browse Restaurants</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 