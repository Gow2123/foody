import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Simple backend URL config
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://foody-backend0.vercel.app');

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsRes = await fetch(`${BACKEND_URL}/products`);
        
        // Fetch categories (with fallback)
        let categoriesRes = await fetch(`${BACKEND_URL}/api/categories`);
        if (!categoriesRes.ok) {
          categoriesRes = await fetch(`${BACKEND_URL}/products/categories`);
        }
        
        // Fetch restaurants (with fallback)
        let restaurantsRes = await fetch(`${BACKEND_URL}/api/restaurants`);
        if (!restaurantsRes.ok) {
          restaurantsRes = await fetch(`${BACKEND_URL}/products/restaurants`);
        }
        
        // Parse the responses
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const restaurantsData = await restaurantsRes.json();
        
        // Set the data in state
        setProducts(productsData.filter(product => product.image));
        setCategories(categoriesData.filter(category => category.image));
        setRestaurants(restaurantsData.filter(restaurant => restaurant.image));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding to cart
  const handleQuickAdd = (product) => {
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

  // Get top restaurants and products
  const topRestaurants = restaurants.slice(0, 4);
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="container mt-3">
      {/* Simple Hero Section */}
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Delicious Food Delivered</h1>
        <p className="lead">Order from top restaurants in your area</p>
        <div className="mt-4">
          <Link to="/restaurants" className="btn btn-primary me-2">Browse Restaurants</Link>
          <Link to="/all-products" className="btn btn-outline-secondary">See All Food</Link>
        </div>
      </div>

      {/* Featured Restaurants */}
      <section className="mb-4">
        <h2 className="mb-3">Popular Restaurants</h2>
        <div className="row">
          {topRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="col-md-3 mb-3">
              <div className="card h-100">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="card-img-top"
                  style={{ height: '160px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text small text-muted">
                    {restaurant.cuisineType || restaurant.type} • {restaurant.rating} ★
                  </p>
                  <Link to={`/restaurant/${restaurant._id}`} className="btn btn-sm btn-outline-primary">
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-end">
          <Link to="/restaurants" className="btn btn-link">View all restaurants →</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-4">
        <h2 className="mb-3">Popular Items</h2>
        <div className="row">
          {featuredProducts.map((product) => (
            <div key={product._id} className="col-md-4 mb-3">
              <div className="card h-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text small">{product.description?.substring(0, 60)}...</p>
                  <p className="card-text">${product.price?.toFixed(2)}</p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-secondary">
                      View Details
                    </Link>
                    <button 
                      className="btn btn-sm btn-success" 
                      onClick={() => handleQuickAdd(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-end">
          <Link to="/all-products" className="btn btn-link">View all items →</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-4">
        <h2 className="mb-3">Food Categories</h2>
        <div className="row">
          {categories.slice(0, 6).map((category) => (
            <div key={category._id} className="col-md-2 col-4 mb-3">
              <Link to={`/category/${category._id}`} className="text-decoration-none">
                <div className="card text-center h-100">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="card-img-top"
                    style={{ height: '100px', objectFit: 'cover' }}
                  />
                  <div className="card-body p-2">
                    <p className="card-title small">{category.name}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-end">
          <Link to="/categories" className="btn btn-link">View all categories →</Link>
        </div>
      </section>
    </div>
  );
}

Home.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Home; 