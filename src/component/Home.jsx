import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Ensure slash for fetch
        const [productsRes, categoriesRes, restaurantsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/products`),
          fetch(`${BACKEND_URL}/products/categories`),
          fetch(`${BACKEND_URL}/products/restaurants`)
        ]);

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!restaurantsRes.ok) throw new Error('Failed to fetch restaurants');

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const restaurantsData = await restaurantsRes.json();

        // Filter out items without images
        const filteredProducts = productsData.filter(product => product.image);
        const filteredCategories = categoriesData.filter(category => category.image);
        const filteredRestaurants = restaurantsData.filter(restaurant => restaurant.image);

        setProducts(filteredProducts);
        setCategories(filteredCategories);
        setRestaurants(filteredRestaurants);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

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

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  // Get featured products (first 3)
  const featuredProducts = products.slice(0, 3);
  
  // Get top rated restaurants (first 3)
  const topRestaurants = [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Banner Section */}
      <div className="hero-banner position-relative mb-5">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop" 
          alt="Delicious Food" 
          className="w-100"
          style={{ height: '500px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop";
            e.target.onerror = null;
          }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">Delicious Food Delivered</h1>
          <p className="lead mb-4">Order your favorite meals from top restaurants</p>
          <Link to="/restaurants" className="btn btn-danger btn-lg me-2">Browse Restaurants</Link>
          <Link to="/categories" className="btn btn-outline-light btn-lg">View Categories</Link>
        </div>
      </div>

      <div className="container">
        {/* Featured Products Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Featured Menu Items</h2>
            <Link to="/products" className="btn btn-outline-danger">View All</Link>
          </div>
          <div className="row">
            {featuredProducts.map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <img 
                      src={product.image} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                        e.target.onerror = null;
                      }}
                    />
                    <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                      Featured
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning me-1">★</span>
                      <span>{product.rating}</span>
                      <span className="ms-2 text-muted">{product.restaurant}</span>
                    </div>
                    <p className="card-text text-muted">{product.description}</p>
                    <p className="card-text fw-bold">${product.price}</p>
                    <div className="d-flex justify-content-between">
                      <Link to={`/product/${product._id}`} className="btn btn-outline-danger">
                        View Details
                      </Link>
                      <button 
                        className="btn btn-danger" 
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
        </section>

        {/* Promotional Banner */}
        <section className="mb-5">
          <div className="card bg-dark text-white">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1469&auto=format&fit=crop" 
              className="card-img" 
              alt="Special Offer"
              style={{ height: '250px', objectFit: 'cover', opacity: '0.7' }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop";
                e.target.onerror = null;
              }}
            />
            <div className="card-img-overlay d-flex flex-column justify-content-center text-center">
              <h3 className="card-title">Special Weekend Offer</h3>
              <p className="card-text">Get 20% off on orders above $30</p>
              <p className="card-text">Use code: <span className="fw-bold">WEEKEND20</span></p>
              <Link to="/restaurants" className="btn btn-danger mx-auto" style={{ width: 'fit-content' }}>
                Order Now
              </Link>
            </div>
          </div>
        </section>

        {/* Top Restaurants Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Top Rated Restaurants</h2>
            <Link to="/restaurants" className="btn btn-outline-danger">View All</Link>
          </div>
          <div className="row">
            {topRestaurants.map(restaurant => (
              <div key={restaurant._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={restaurant.image} 
                    className="card-img-top" 
                    alt={restaurant.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1374&auto=format&fit=crop";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <span className="text-warning">★</span>
                        <span className="ms-1">{restaurant.rating}</span>
                      </div>
                      <span className="text-muted">{restaurant.deliveryTime} delivery</span>
                    </div>
                    <p className="card-text text-muted">{restaurant.description}</p>
                    <Link to={`/restaurant/${restaurant._id}`} className="btn btn-outline-danger w-100 mt-2">
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Categories */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Browse By Category</h2>
            <Link to="/categories" className="btn btn-outline-danger">View All</Link>
          </div>
          <div className="row">
            {categories.map(category => (
              <div key={category._id} className="col-md-4 mb-4">
                <div className="card bg-dark text-white h-100">
                  <img 
                    src={category.image} 
                    className="card-img" 
                    alt={category.name}
                    style={{ height: '180px', objectFit: 'cover', opacity: '0.7' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=1470&auto=format&fit=crop";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="card-img-overlay d-flex flex-column justify-content-center text-center">
                    <h3 className="card-title">{category.name}</h3>
                    <Link to={`/category/${category._id}`} className="btn btn-outline-light mt-3">
                      Browse {category.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* App Download Section */}
        <section className="mb-5 bg-light p-5 rounded">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h2>Download Our Mobile App</h2>
              <p className="lead">Get exclusive offers and track your orders in real-time</p>
              <div className="d-flex flex-column flex-md-row gap-2 justify-content-center justify-content-md-start">
                <button className="btn btn-dark">
                  <i className="bi bi-apple me-2"></i>App Store
                </button>
                <button className="btn btn-dark">
                  <i className="bi bi-google-play me-2"></i>Google Play
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1374&auto=format&fit=crop" 
                alt="Mobile App" 
                className="img-fluid rounded"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop";
                  e.target.onerror = null;
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Home.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Home; 