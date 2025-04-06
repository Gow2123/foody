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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('rating');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/products/restaurants`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
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
    
    // Filter out restaurants with no images or broken images
    results = results.filter(restaurant => restaurant.image);
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(restaurant => 
        restaurant.category === selectedCategory
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
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery':
        // Sort by delivery time (assuming format like "30-45 min")
        results.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
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
  }, [restaurants, searchTerm, selectedCategory, sortOption, minRating]);

  // Get unique categories from restaurants
  const categories = ['all', ...new Set(restaurants.map(restaurant => restaurant.category))];

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      {/* Hero section */}
      <div className="card bg-dark text-white mb-5">
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
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
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {minRating > 0 && ` with ${minRating}+ stars`}
        </p>
      </div>

      {/* Restaurant cards */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center my-5">
          <h3>No restaurants found</h3>
          <p className="text-muted">Try adjusting your filters</p>
          <button 
            className="btn btn-outline-danger"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setMinRating(0);
              setSortOption('rating');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
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
                  {restaurant.rating >= 4.5 && (
                    <div className="position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded-pill">
                      Top Rated
                    </div>
                  )}
                  <div className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded-pill">
                    {restaurant.category}
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text text-muted">{restaurant.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-warning">★</span>
                      <span className="ms-1">{restaurant.rating}</span>
                      <span className="badge bg-light text-dark ms-2">{restaurant.category}</span>
                    </div>
                    <span className="text-muted">{restaurant.deliveryTime} delivery</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-muted">
                      <i className="bi bi-clock me-1"></i> Open Now
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-geo-alt me-1"></i> 2.5 km away
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to={`/restaurant/${restaurant._id}`} className="btn btn-outline-danger w-100">
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="d-flex justify-content-center mt-4 mb-5">
        <nav aria-label="Restaurant pagination">
          <ul className="pagination">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Restaurants; 