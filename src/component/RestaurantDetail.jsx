import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BACKEND_URL = 'http://localhost:3000';

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch restaurant data
    fetch(`${BACKEND_URL}/products/restaurant/${id}`)
      .then(res => res.json())
      .then(data => {
        setRestaurant(data);
        
        // Fetch menu items
        return fetch(`${BACKEND_URL}/products/by-restaurant/${id}`);
      })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <p>{restaurant.cuisineType || restaurant.type}</p>
        </div>
      </div>

      {/* Menu */}
      <h2>Menu</h2>
      
      {products.length === 0 ? (
        <div className="alert alert-info">No menu items available</div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src={product.image} alt={product.name} className="img-fluid" />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p>${product.price.toFixed(2)}</p>
                      <button 
                        className="btn btn-primary" 
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
      
      <Link to="/restaurants" className="btn btn-secondary mt-3">Back</Link>
    </div>
  );
}

RestaurantDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default RestaurantDetail; 