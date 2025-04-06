import { useState, useEffect, useRef } from 'react';
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const categoryScrollRef = useRef(null);

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
        setFilteredProducts(filteredProducts);
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

  // Filter products when active category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory, products]);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

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

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading delicious content...</p>
        <div className="progress mt-2" style={{height: '4px'}}>
          <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated" style={{width: '100%'}}></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  // Get top rated restaurants (first 3)
  const topRestaurants = [...restaurants]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  // Get trending products (highest rated)
  const trendingProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

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
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.4 }}></div>
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">Delicious Food Delivered</h1>
          <p className="lead mb-4">Order your favorite meals from top restaurants</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/restaurants" className="btn btn-danger btn-lg">Browse Restaurants</Link>
            <Link to="/categories" className="btn btn-outline-light btn-lg">View Categories</Link>
            <Link to="/all-products" className="btn btn-light btn-lg">All Products</Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Category Quick Access */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Categories</h2>
            <div>
              <button 
                className="btn btn-sm btn-outline-danger me-2" 
                onClick={() => scrollCategories('left')}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => scrollCategories('right')}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
          <div className="position-relative mb-4">
            <div 
              ref={categoryScrollRef}
              className="d-flex overflow-auto pb-2" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div 
                className={`category-item flex-shrink-0 me-3 cursor-pointer ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                <div className={`rounded-circle bg-${activeCategory === 'all' ? 'danger' : 'light'} d-flex align-items-center justify-content-center mb-2`} style={{ width: '80px', height: '80px' }}>
                  <i className={`bi bi-grid text-${activeCategory === 'all' ? 'white' : 'danger'} fs-3`}></i>
                </div>
                <p className="text-center mb-0">All</p>
              </div>
              
              {categories.map(category => (
                <div 
                  key={category._id} 
                  className="category-item flex-shrink-0 me-3 cursor-pointer"
                  onClick={() => handleCategoryClick(category.category)}
                >
                  <div 
                    className={`position-relative rounded-circle overflow-hidden mb-2 ${activeCategory === category.category ? 'border border-3 border-danger' : ''}`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=1470&auto=format&fit=crop";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <p className="text-center mb-0">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtered Products Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{activeCategory === 'all' ? 'Featured Products' : `${activeCategory} Items`}</h2>
            <Link to="/all-products" className="btn btn-outline-danger">View All</Link>
          </div>
          <div className="row">
            {filteredProducts.slice(0, 6).map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm hover-card">
                  <div className="position-relative overflow-hidden">
                    <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.image} 
                        className="card-img-top" 
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                          e.target.onerror = null;
                        }}
                      />
                    </Link>
                    {product.rating && (
                      <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded-pill">
                        <i className="bi bi-star-fill me-1"></i>
                        {product.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                        {product.name}
                      </Link>
                    </h5>
                    <div className="d-flex align-items-center mb-2">
                      <span className="badge bg-secondary me-2">{product.category}</span>
                      <span className="text-muted small">{product.restaurant}</span>
                    </div>
                    <p className="card-text text-muted small">
                      {product.description?.substring(0, 80)}
                      {product.description?.length > 80 ? '...' : ''}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="fw-bold text-danger">${Number(product.price).toFixed(2)}</span>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleQuickAdd(product)}
                      >
                        <i className="bi bi-cart-plus"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-5 bg-light rounded">
              <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
              <h4 className="mt-3">No products found</h4>
              <p className="text-muted">Try selecting a different category</p>
              <button 
                className="btn btn-danger mt-2"
                onClick={() => setActiveCategory('all')}
              >
                View All Products
              </button>
            </div>
          )}
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
              <Link to="/all-products" className="btn btn-danger mx-auto" style={{ width: 'fit-content' }}>
                Order Now
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="mb-5">
          <div className="bg-light p-4 rounded shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="mb-0">
                <i className="bi bi-graph-up-arrow text-danger me-2"></i>
                Trending Now
              </h2>
              <Link to="/all-products" className="btn btn-sm btn-danger">See All</Link>
            </div>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
              {trendingProducts.map((product) => (
                <div key={product._id} className="col">
                  <div className="card h-100 shadow-sm border-0 hover-card">
                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                      <div className="position-relative">
                        <img 
                          src={product.image} 
                          className="card-img-top" 
                          alt={product.name}
                          style={{ height: '120px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                            e.target.onerror = null;
                          }}
                        />
                        <div className="position-absolute top-0 end-0 bg-danger text-white p-1 m-1 small">
                          <i className="bi bi-star-fill me-1"></i>
                          {product.rating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                    </Link>
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1">
                        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                          {product.name.length > 18 ? product.name.substring(0, 16) + '...' : product.name}
                        </Link>
                      </h6>
                      <p className="mb-0 text-danger fw-bold small">${Number(product.price).toFixed(2)}</p>
                      <button 
                        className="btn btn-sm btn-outline-danger mt-2 w-100" 
                        onClick={() => handleQuickAdd(product)}
                      >
                        <i className="bi bi-cart-plus"></i> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                <div className="card h-100 shadow-sm hover-card">
                  <div className="position-relative">
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
                    {restaurant.rating && (
                      <div className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 m-2 rounded-pill">
                        <i className="bi bi-star-fill me-1"></i>
                        {restaurant.rating}
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary me-2">{restaurant.type || 'Restaurant'}</span>
                      <span className="text-muted small">
                        <i className="bi bi-clock me-1"></i>
                        {restaurant.deliveryTime || 'N/A'}
                      </span>
                    </div>
                    <p className="card-text text-muted small">
                      {restaurant.description?.substring(0, 80)}
                      {restaurant.description?.length > 80 ? '...' : ''}
                    </p>
                    <Link to={`/restaurant/${restaurant._id}`} className="btn btn-outline-danger w-100 mt-2">
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* App Benefits */}
        <section className="mb-5">
          <div className="row text-center py-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="p-3">
                <div className="bg-danger text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: "60px", height: "60px"}}>
                  <i className="bi bi-lightning-charge fs-2"></i>
                </div>
                <h4>Fast Delivery</h4>
                <p className="text-muted">Food delivered fresh and hot in under 30 minutes</p>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="p-3">
                <div className="bg-danger text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: "60px", height: "60px"}}>
                  <i className="bi bi-hand-thumbs-up fs-2"></i>
                </div>
                <h4>Best Quality</h4>
                <p className="text-muted">We partner only with the best restaurants in town</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="bg-danger text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{width: "60px", height: "60px"}}>
                  <i className="bi bi-wallet2 fs-2"></i>
                </div>
                <h4>Great Value</h4>
                <p className="text-muted">Competitive prices and regular special deals</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <section className="bg-danger text-white text-center py-5 mb-5">
        <div className="container">
          <h2 className="mb-3">Ready to order your favorite food?</h2>
          <p className="mb-4">Browse our full menu with thousands of delicious options</p>
          <Link to="/all-products" className="btn btn-light btn-lg px-4">
            Explore All Products
          </Link>
        </div>
      </section>

      {/* Add custom CSS for hover effects */}
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .category-item {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .category-item:hover {
          transform: scale(1.05);
        }
        .overflow-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

Home.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Home; 