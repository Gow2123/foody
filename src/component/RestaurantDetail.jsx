import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import BACKEND_URL from '../config';

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log(`Fetching restaurant ${id} from: ${BACKEND_URL}`);
    
    // Fetch restaurant details
    fetch(`${BACKEND_URL}/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => {
        setRestaurant(data);
        return fetch(`${BACKEND_URL}/api/products/restaurant/${id}`);
      })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching restaurant data:", err);
        setLoading(false);
      });
  }, [id]);
  
  // Add to cart function
  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };
  
  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  
  if (!restaurant) return <div className="container mt-5">Restaurant not found</div>;

  return (
    <div className="container mt-4">
      {/* Restaurant info */}
      <div className="row mb-4">
        <div className="col-md-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-8">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="mb-3">
            <span className="badge bg-primary me-2">Rating: {restaurant.rating}★</span>
            <span className="badge bg-secondary me-2">{restaurant.cuisineType || restaurant.type}</span>
            <span className="badge bg-info">Delivery: {restaurant.deliveryTime} min</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <h2>Menu</h2>
      
      {products.length === 0 ? (
        <div className="alert alert-info">No menu items available</div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Link to="/restaurants" className="btn btn-secondary mt-3">Back</Link>
    </div>
  );
}

RestaurantDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default RestaurantDetail; 