import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

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

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndProducts = async () => {
      try {
        // Add error logging to see exactly what's failing
        console.log("Fetching restaurant data from:", `${BACKEND_URL}/products/restaurant/${id}`);
        
        const restaurantResponse = await fetch(`${BACKEND_URL}/products/restaurant/${id}`);
        if (!restaurantResponse.ok) {
          console.error("Restaurant fetch failed:", restaurantResponse.status);
          throw new Error(`Failed to fetch restaurant: ${restaurantResponse.status}`);
        }
        
        console.log("Fetching products from:", `${BACKEND_URL}/products/restaurant/${id}/products`);
        const productsResponse = await fetch(`${BACKEND_URL}/products/restaurant/${id}/products`);
        if (!productsResponse.ok) {
          console.error("Products fetch failed:", productsResponse.status);
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }

        // Process responses
        const restaurantData = await restaurantResponse.json();
        const productsData = await productsResponse.json();
        
        // Add defensive checks
        if (!restaurantData) throw new Error("Empty restaurant data");
        
        setRestaurant(restaurantData);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Error in fetchRestaurantAndProducts:", err);
        setError(err.message);
        // Set empty state to prevent rendering errors
        setRestaurant(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndProducts();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  if (!restaurant) return <div className="text-center mt-5">Restaurant not found</div>;

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="img-fluid rounded"
            style={{ width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Replace with a default restaurant image
              e.target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1374&auto=format&fit=crop";
              e.target.onerror = null; // Prevent infinite loops
            }}
          />
        </div>
        <div className="col-md-8">
          <h2>{restaurant?.name || 'Restaurant'}</h2>
          <p className="text-muted">{restaurant?.description || 'No description available'}</p>
          <div className="d-flex align-items-center">
            <span className="text-warning me-2">★</span>
            <span className="me-3">{restaurant.rating || 'N/A'}</span>
            <span className="text-muted">•</span>
            <span className="ms-3">{restaurant.deliveryTime || 'Unknown'} delivery</span>
          </div>
        </div>
      </div>

      <h3 className="mb-4">Menu</h3>
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 text-center">
            <p>No menu items available for this restaurant.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    // Replace with a default food item image
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                    e.target.onerror = null; // Prevent infinite loops
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-danger mb-0">${Number(product.price).toFixed(2)}</h5>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => addToCart({
                        _id: product._id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                      })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

RestaurantDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default RestaurantDetail; 