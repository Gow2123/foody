// Restaurants component with enhanced features

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Simple backend URL config
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://foody-backend0.vercel.app');

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Fetch restaurants data
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        // Try main API endpoint with fallback
        let response = await fetch(`${BACKEND_URL}/api/restaurants`);
        if (!response.ok) {
          response = await fetch(`${BACKEND_URL}/products/restaurants`);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch restaurants`);
        }
        
        const data = await response.json();
        setRestaurants(data.filter(restaurant => restaurant.image));
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant => 
    searchTerm === '' || 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.description && restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading state
  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div><p>Loading...</p></div>;
  
  // Error state
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Restaurants</h1>
      
      {/* Simple search box */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search restaurants..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Restaurant list */}
      {filteredRestaurants.length === 0 ? (
        <div className="alert alert-info">No restaurants found</div>
      ) : (
        <div className="row">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b";
                    e.target.onerror = null;
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text text-muted">{restaurant.cuisineType || restaurant.type}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      <span className="me-2">⭐ {restaurant.rating}</span>
                      <span>🕒 {restaurant.deliveryTime}</span>
                    </small>
                  </p>
                  <Link to={`/restaurant/${restaurant._id}`} className="btn btn-primary">
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Restaurants; 