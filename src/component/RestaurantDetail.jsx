import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Simple backend URL config
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://foody-backend0.vercel.app');

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch restaurant and its products
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant details
        let restaurantResponse = await fetch(`${BACKEND_URL}/api/restaurants/${id}`);
        if (!restaurantResponse.ok) {
          restaurantResponse = await fetch(`${BACKEND_URL}/products/restaurant/${id}`);
        }
        
        if (!restaurantResponse.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        
        const restaurantData = await restaurantResponse.json();
        setRestaurant(restaurantData);
        
        // Fetch products for this restaurant
        let productsResponse = await fetch(`${BACKEND_URL}/api/restaurants/${id}/products`);
        if (!productsResponse.ok) {
          productsResponse = await fetch(`${BACKEND_URL}/products/restaurant/${id}/products`);
        }
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch restaurant products');
        }
        
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [id]);
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      quantity: 1
    });
  };
  
  // Loading state
  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div><p>Loading...</p></div>;
  
  // Error state
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  
  // Not found state
  if (!restaurant) return <div className="container mt-5 alert alert-warning">Restaurant not found</div>;

  return (
    <div className="container mt-4">
      {/* Restaurant header */}
      <div className="row mb-4">
        <div className="col-md-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="img-fluid rounded"
            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <h1>{restaurant.name}</h1>
          <p className="text-muted">{restaurant.description}</p>
          <div className="mb-3">
            <span className="badge bg-light text-dark me-2">{restaurant.cuisineType || restaurant.type}</span>
            <span className="me-3">⭐ {restaurant.rating}</span>
            <span className="me-3">🕒 {restaurant.deliveryTime}</span>
            <span>{restaurant.priceRange}</span>
          </div>
          <p><small>📍 {restaurant.address || 'Address not available'}</small></p>
          <p><small>📞 {restaurant.phone || 'Phone not available'}</small></p>
          <p><small>🕒 {restaurant.openingHours || 'Opening hours not available'}</small></p>
        </div>
      </div>

      {/* Menu section */}
      <h2 className="mb-3">Menu</h2>
      
      {products.length === 0 ? (
        <div className="alert alert-info">No menu items available for this restaurant</div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product._id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="img-fluid rounded-start h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text small">{product.description}</p>
                      <p className="card-text">${product.price.toFixed(2)}</p>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 mb-5">
        <Link to="/restaurants" className="btn btn-outline-secondary">Back to Restaurants</Link>
      </div>
    </div>
  );
}

RestaurantDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default RestaurantDetail; 