import { useState, useEffect, useMemo, useCallback } from 'react';
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

// Simple request cache
const apiCache = {
  data: {},
  timestamp: {},
  get: function(key) {
    // Return null if not in cache or if older than 5 minutes
    const now = Date.now();
    if (this.data[key] && (now - this.timestamp[key] < 5 * 60 * 1000)) {
      return this.data[key];
    }
    return null;
  },
  set: function(key, data) {
    this.data[key] = data;
    this.timestamp[key] = Date.now();
  }
};

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch restaurant and its products with caching
  const fetchRestaurantAndProducts = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      const cacheKey = `restaurant-${id}`;
      
      // Try to get from cache first unless forcing refresh
      if (!forceRefresh) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
          console.log('Using cached restaurant data');
          setRestaurant(cachedData.restaurant);
          setMenuItems(cachedData.menuItems);
          setLoading(false);
          return;
        }
      }
      
      console.log(`Fetching restaurant details for ID: ${id}`);
      
      // Fetch the restaurant details
      const restaurantRes = await fetch(`${BACKEND_URL}/products/restaurant/${id}`, {
        headers: {
          'Accept': 'application/json'
        },
        cache: 'default'
      });
      
      if (!restaurantRes.ok) {
        throw new Error(`Failed to fetch restaurant: ${restaurantRes.status}`);
      }
      
      const restaurantData = await restaurantRes.json();
      
      // Restaurant might be returned as part of an array or as a single object
      const restaurantInfo = Array.isArray(restaurantData) ? restaurantData[0] : restaurantData;
      
      if (!restaurantInfo) {
        throw new Error('Restaurant not found');
      }
      
      // Fetch the menu items for this restaurant
      const productsRes = await fetch(`${BACKEND_URL}/products/by-restaurant/${id}`, {
        headers: {
          'Accept': 'application/json'
        },
        cache: 'default'
      });
      
      if (!productsRes.ok) {
        throw new Error(`Failed to fetch menu items: ${productsRes.status}`);
      }
      
      const productsData = await productsRes.json();
      
      // Cache the results
      apiCache.set(cacheKey, {
        restaurant: restaurantInfo,
        menuItems: productsData
      });
      
      setRestaurant(restaurantInfo);
      setMenuItems(productsData);
      
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load data on component mount or when ID changes
  useEffect(() => {
    fetchRestaurantAndProducts();
  }, [fetchRestaurantAndProducts]);

  // Handle add to cart with quantity
  const handleAddToCart = useCallback((product) => {
    addToCart({ ...product, quantity: 1 });
  }, [addToCart]);

  // Memoize menu categories to avoid recalculation
  const menuCategories = useMemo(() => {
    if (!menuItems.length) return [];
    
    // Group menu items by category
    const categories = {};
    menuItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    return Object.entries(categories).map(([category, items]) => ({
      name: category,
      items
    }));
  }, [menuItems]);

  // Loading state
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading restaurant details...</p>
          <div className="progress mt-2" style={{height: '4px'}}>
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading restaurant</h4>
          <p>{error}</p>
          <button className="btn btn-success mt-2" onClick={() => fetchRestaurantAndProducts(true)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no restaurant data (and not loading/error), show not found
  if (!restaurant) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Restaurant not found</h4>
          <p>The restaurant you are looking for could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Restaurant Header */}
      <div className="card mb-5 shadow">
        <div className="row g-0">
          <div className="col-md-5">
            <img 
              src={restaurant.image} 
              className="img-fluid rounded-start h-100"
              alt={restaurant.name} 
              style={{ objectFit: 'cover' }}
              loading="eager" // Load this image with priority
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1770&auto=format&fit=crop";
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body d-flex flex-column h-100">
              <h1 className="card-title display-5 mb-3">{restaurant.name}</h1>
              <p className="card-text flex-grow-1">{restaurant.description || 'Welcome to our restaurant. We serve delicious food made with the finest ingredients.'}</p>
              
              <div className="row mt-auto">
                <div className="col-sm-4 mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-success p-2 rounded-circle me-2 text-white">
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <div>
                      <strong>{restaurant.rating || 'N/A'}</strong>
                      <p className="text-muted mb-0 small">Rating</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-sm-4 mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary p-2 rounded-circle me-2 text-white">
                      <i className="bi bi-truck"></i>
                    </div>
                    <div>
                      <strong>{restaurant.deliveryTime || 'Unknown'}</strong>
                      <p className="text-muted mb-0 small">Delivery Time</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-sm-4 mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning p-2 rounded-circle me-2 text-dark">
                      <i className="bi bi-tag-fill"></i>
                    </div>
                    <div>
                      <strong>{restaurant.type || 'Various'}</strong>
                      <p className="text-muted mb-0 small">Cuisine</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      <h2 className="mb-4">Menu</h2>
      
      {menuCategories.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">No menu items available for this restaurant.</p>
        </div>
      ) : (
        <>
          {menuCategories.map((category, index) => (
            <div key={index} className="mb-5">
              <h3 className="border-bottom pb-2 mb-4">{category.name}</h3>
              <div className="row">
                {category.items.map(item => (
                  <div key={item._id} className="col-lg-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img 
                            src={item.image} 
                            className="img-fluid rounded-start h-100"
                            alt={item.name} 
                            style={{ objectFit: 'cover' }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body d-flex flex-column h-100">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text text-muted small flex-grow-1">
                              {item.description?.substring(0, 100)}
                              {item.description?.length > 100 ? '...' : ''}
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="text-success fw-bold">${Number(item.price).toFixed(2)}</span>
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleAddToCart(item)}
                              >
                                <i className="bi bi-cart-plus"></i> Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

RestaurantDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default RestaurantDetail; 