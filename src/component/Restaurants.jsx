// Restaurants component with enhanced features

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../config';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    console.log("Fetching restaurants from:", BACKEND_URL);
    fetch(`${BACKEND_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => {
        console.log(`Found ${data.length} restaurants`);
        setRestaurants(data.filter(r => r.image));
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
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