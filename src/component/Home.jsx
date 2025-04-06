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
        setLoading(true);
        
        // Use the dedicated API endpoints
        const [productsRes, categoriesRes, restaurantsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/products`),
          fetch(`${BACKEND_URL}/api/categories`),
          fetch(`${BACKEND_URL}/api/restaurants`)
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
        
        console.log("Fetched restaurants:", filteredRestaurants.length);
      } catch (err) {
        console.error("Error fetching data:", err);
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
    <div className="container mt-5 pt-5">
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
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error Loading Data</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    </div>
  );

  // Get top rated restaurants
  const topRestaurants = [...restaurants]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // Get trending products (highest rated)
  const trendingProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return (
    <div>
      {/* Hero Banner Section with Overlay Text */}
      <div className="hero-banner position-relative mb-5">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop" 
          alt="Delicious Food" 
          className="w-100"
          style={{ height: '600px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop";
            e.target.onerror = null;
          }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }}></div>
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-3 fw-bold mb-3">Delicious Food Delivered</h1>
          <p className="lead fs-4 mb-4">Order your favorite meals from top restaurants in your area</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/restaurants" className="btn btn-danger btn-lg px-4 py-2">
              <i className="bi bi-shop me-2"></i>Browse Restaurants
            </Link>
            <Link to="/all-products" className="btn btn-light btn-lg px-4 py-2">
              <i className="bi bi-search me-2"></i>Explore Menu
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Restaurants Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold"><i className="bi bi-star-fill text-warning me-2"></i>Top Restaurants</h2>
            <Link to="/restaurants" className="btn btn-outline-danger">View All</Link>
          </div>
          
          <div className="row">
            {topRestaurants.length > 0 ? (
              topRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="col-md-3 mb-4">
                  <div className="card h-100 shadow hover-card border-0">
                    <div className="position-relative overflow-hidden">
                      <Link to={`/restaurant/${restaurant._id}`}>
                        <img 
                          src={restaurant.image} 
                          className="card-img-top" 
                          alt={restaurant.name}
                          style={{ height: '180px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1374&auto=format&fit=crop";
                            e.target.onerror = null;
                          }}
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 hover-overlay" 
                             style={{ transition: 'opacity 0.3s ease' }}></div>
                      </Link>
                      <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                        <i className="bi bi-star-fill me-1"></i>
                        {restaurant.rating?.toFixed(1) || '4.0'}
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/restaurant/${restaurant._id}`} className="text-decoration-none text-dark">
                          {restaurant.name}
                        </Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">
                          {restaurant.cuisineType || restaurant.type || 'Various'}
                        </span>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {restaurant.deliveryTime || '30-45 min'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No restaurants available at the moment. Please check back later.
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Category Quick Access - Horizontal Scrollable */}
        <section className="mb-5 py-4 bg-light rounded-3">
          <div className="d-flex justify-content-between align-items-center mb-3 px-3">
            <h2 className="fw-bold"><i className="bi bi-grid me-2"></i>Food Categories</h2>
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
              className="d-flex overflow-auto px-3 pb-2" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div 
                className={`category-item flex-shrink-0 me-4 cursor-pointer ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
                style={{ cursor: 'pointer' }}
              >
                <div className={`rounded-circle bg-${activeCategory === 'all' ? 'danger' : 'white'} d-flex align-items-center justify-content-center mb-2 shadow-sm`} 
                     style={{ width: '90px', height: '90px', transition: 'all 0.3s ease' }}>
                  <i className={`bi bi-grid-3x3-gap text-${activeCategory === 'all' ? 'white' : 'danger'} fs-2`}></i>
                </div>
                <p className="text-center mb-0 small fw-bold">All Items</p>
              </div>
              
              {categories.map(category => (
                <div 
                  key={category._id} 
                  className="category-item flex-shrink-0 me-4"
                  onClick={() => handleCategoryClick(category.category)}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className={`position-relative rounded-circle overflow-hidden mb-2 shadow-sm ${activeCategory === category.category ? 'border border-3 border-danger' : ''}`}
                    style={{ width: '90px', height: '90px', transition: 'all 0.3s ease' }}
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
                    <div className={`position-absolute top-0 start-0 w-100 h-100 bg-dark ${activeCategory === category.category ? 'opacity-0' : 'opacity-50'}`} 
                         style={{ transition: 'opacity 0.3s ease' }}></div>
                  </div>
                  <p className="text-center mb-0 small fw-bold">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtered Products Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">
              {activeCategory === 'all' 
                ? <><i className="bi bi-fire text-danger me-2"></i>Featured Menu</>
                : <>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Items</>
              }
            </h2>
            <Link to="/all-products" className="btn btn-outline-danger">View All</Link>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No products found in this category. Try selecting a different category.
            </div>
          ) : (
            <div className="row">
              {filteredProducts.slice(0, 6).map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm hover-card border-0">
                    <div className="position-relative overflow-hidden">
                      <Link to={`/product/${product._id}`}>
                        <img 
                          src={product.image} 
                          className="card-img-top" 
                          alt={product.name}
                          style={{ height: '220px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
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
                      {product.restaurant && (
                        <div className="position-absolute bottom-0 start-0 bg-dark text-white px-2 py-1 m-2 rounded-pill">
                          <i className="bi bi-shop me-1"></i>
                          {product.restaurant}
                        </div>
                      )}
                      <button 
                        className="btn btn-sm btn-danger position-absolute bottom-0 end-0 m-2"
                        onClick={() => handleQuickAdd(product)}
                      >
                        <i className="bi bi-plus-lg"></i> Add
                      </button>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                          {product.name}
                        </Link>
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-light text-dark">{product.category}</span>
                        <span className="text-success fw-bold">${product.price.toFixed(2)}</span>
                      </div>
                      <p className="card-text small text-muted">{product.description.substring(0, 60)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mb-5">
          <div className="card border-0 rounded-3 bg-danger text-white">
            <div className="row g-0">
              <div className="col-md-8">
                <div className="card-body p-5">
                  <h3 className="card-title fw-bold">Hungry? We've got you covered!</h3>
                  <p className="card-text fs-5 mb-4">Order your favorite food from the best restaurants in town, delivered straight to your door.</p>
                  <Link to="/all-products" className="btn btn-light btn-lg">
                    <i className="bi bi-arrow-right-circle me-2"></i>Browse Our Full Menu
                  </Link>
                </div>
              </div>
              <div className="col-md-4 d-none d-md-block">
                <img 
                  src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1470&auto=format&fit=crop" 
                  alt="Food delivery" 
                  className="img-fluid rounded-end" 
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now Section */}
        {trendingProducts.length > 0 && (
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold"><i className="bi bi-graph-up-arrow text-danger me-2"></i>Trending Now</h2>
              <Link to="/all-products" className="btn btn-outline-danger">View All</Link>
            </div>
            <div className="row">
              {trendingProducts.slice(0, 3).map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm border-0 bg-light">
                    <div className="row g-0">
                      <div className="col-5">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="img-fluid rounded-start h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="col-7">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <span className="badge bg-danger mb-2">Trending</span>
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-star-fill"></i> {product.rating?.toFixed(1) || '4.0'}
                            </span>
                          </div>
                          <h5 className="card-title">
                            <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                              {product.name}
                            </Link>
                          </h5>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="fw-bold text-danger">${product.price.toFixed(2)}</span>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleQuickAdd(product)}
                            >
                              <i className="bi bi-cart-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* App Features Section */}
      <section className="bg-light py-5 mb-0">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose Foody?</h2>
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="text-center">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-lightning-charge-fill fs-2"></i>
                </div>
                <h4>Fast Delivery</h4>
                <p className="text-muted">Your favorite food delivered hot and fresh to your doorstep.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="text-center">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-award-fill fs-2"></i>
                </div>
                <h4>Quality Food</h4>
                <p className="text-muted">We partner with the best restaurants to ensure quality meals.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-wallet2 fs-2"></i>
                </div>
                <h4>Best Prices</h4>
                <p className="text-muted">Great deals and promotions to get the most value for your money.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Home.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Home; 