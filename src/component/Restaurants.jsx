// Restaurants component with enhanced features

import { useState, useEffect } from 'react';
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

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortOption, setSortOption] = useState('rating');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        // Use the dedicated restaurant API
        const response = await fetch(`${BACKEND_URL}/api/restaurants`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        console.log("Fetched restaurants:", data.length);
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let results = [...restaurants];
    
    // Filter out restaurants with no images
    results = results.filter(restaurant => restaurant.image);
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply cuisine filter
    if (selectedCuisine !== 'all') {
      results = results.filter(restaurant => 
        restaurant.cuisineType === selectedCuisine || restaurant.type === selectedCuisine
      );
    }
    
    // Apply rating filter
    if (minRating > 0) {
      results = results.filter(restaurant => 
        restaurant.rating >= minRating
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'delivery':
        // Sort by delivery time (assuming format like "30-45 min")
        results.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime?.split('-')[0] || '30');
          const bTime = parseInt(b.deliveryTime?.split('-')[0] || '30');
          return aTime - bTime;
        });
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFilteredRestaurants(results);
  }, [restaurants, searchTerm, selectedCuisine, sortOption, minRating]);

  // Get unique cuisine types from restaurants
  const cuisineTypes = ['all'];
  restaurants.forEach(restaurant => {
    const cuisine = restaurant.cuisineType || restaurant.type;
    if (cuisine && !cuisineTypes.includes(cuisine)) {
      cuisineTypes.push(cuisine);
    }
  });

  if (loading) return (
    <div className="container mt-5 pt-5">
      <div className="text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading restaurants...</span>
        </div>
        <p className="mt-3">Discovering restaurants in your area...</p>
        <div className="progress mt-2" style={{height: '4px'}}>
          <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated" style={{width: '100%'}}></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error Loading Restaurants</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      {/* Hero section */}
      <div className="card border-0 bg-dark text-white mb-5 rounded-3 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop" 
          className="card-img" 
          alt="Restaurants"
          style={{ height: '300px', objectFit: 'cover', opacity: '0.7' }}
        />
        <div className="card-img-overlay d-flex align-items-center">
          <div className="container">
            <h1 className="display-4 fw-bold">Explore Restaurants</h1>
            <p className="lead">Discover the best food places in your area</p>
          </div>
        </div>
      </div>

      {/* Search and filters section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-danger text-white">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search restaurants..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-4 mb-3">
              <select 
                className="form-select" 
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === 'all' ? 'All Cuisines' : cuisine}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <select 
                className="form-select" 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="delivery">Fastest Delivery</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <select 
                className="form-select" 
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-muted">
          Showing {filteredRestaurants.length} restaurants
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCuisine !== 'all' && ` in ${selectedCuisine}`}
          {minRating > 0 && ` with ${minRating}+ stars`}
        </p>
      </div>

      {/* Restaurant cards */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center my-5">
          <i className="bi bi-shop-window text-danger display-1 mb-3"></i>
          <h3>No restaurants found</h3>
          <p className="text-muted">Try adjusting your filters</p>
          <button 
            className="btn btn-outline-danger"
            onClick={() => {
              setSearchTerm('');
              setSelectedCuisine('all');
              setMinRating(0);
              setSortOption('rating');
            }}
          >
            <i className="bi bi-arrow-repeat me-2"></i>Reset Filters
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0 hover-card">
                <div className="position-relative">
                  <Link to={`/restaurant/${restaurant._id}`}>
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1374&auto=format&fit=crop";
                        e.target.onerror = null;
                      }}
                    />
                  </Link>
                  {restaurant.rating >= 4.5 && (
                    <div className="position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded-pill">
                      <i className="bi bi-award-fill me-1"></i>Top Rated
                    </div>
                  )}
                  <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                    <i className="bi bi-star-fill me-1"></i>
                    {restaurant.rating?.toFixed(1) || '4.0'}
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/restaurant/${restaurant._id}`} className="text-decoration-none text-dark">
                      {restaurant.name}
                    </Link>
                  </h5>
                  <p className="card-text text-muted small">
                    {restaurant.description?.substring(0, 80)}
                    {restaurant.description?.length > 80 ? '...' : ''}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-dark">
                      {restaurant.cuisineType || restaurant.type || 'Various'}
                    </span>
                    <span className="text-muted small">
                      <i className="bi bi-clock me-1"></i>
                      {restaurant.deliveryTime || '30-45 min'}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      {restaurant.address ? restaurant.address.split(',')[0] : 'Local Area'}
                    </div>
                    <span className="badge bg-light text-dark">
                      {restaurant.priceRange || '$$'}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0">
                  <Link 
                    to={`/restaurant/${restaurant._id}`} 
                    className="btn btn-outline-danger w-100"
                  >
                    <i className="bi bi-menu-button-wide me-1"></i> View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add custom CSS for hover effects */}
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default Restaurants; 