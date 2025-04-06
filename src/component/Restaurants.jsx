// Restaurants component with enhanced features

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:3000';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Basic data fetching
    fetch(`${BACKEND_URL}/products/restaurants`)
      .then(res => res.json())
      .then(data => {
        setRestaurants(data.filter(r => r.image));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter results
  const filteredRestaurants = restaurants.filter(restaurant => 
    searchTerm === '' || restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>Restaurants</h1>
      
      {/* Search */}
      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search restaurants..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results */}
      {filteredRestaurants.length === 0 ? (
        <div className="alert alert-info">No restaurants found</div>
      ) : (
        <div className="row">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={restaurant.image} alt={restaurant.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p>{restaurant.cuisineType || restaurant.type}</p>
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