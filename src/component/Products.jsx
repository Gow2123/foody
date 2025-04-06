import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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

// Simple cache for API requests
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

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // Fetch products from backend with caching
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'products-list';
    
    try {
      setLoading(true);
      
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
          console.log('Using cached products data');
          setProducts(cachedData);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`${BACKEND_URL}/products`, {
        cache: 'default',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter actual products (not categories or restaurants)
      const actualProducts = data.filter(item => !item.type || item.type === 'product');
      
      // Cache the filtered products
      apiCache.set(cacheKey, actualProducts);
      
      setProducts(actualProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  // Fetch categories with caching
  const fetchCategories = useCallback(async () => {
    const cacheKey = 'categories-list';
    
    try {
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        console.log('Using cached categories data');
        setCategories(cachedData);
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/products/categories`, {
        cache: 'default',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the categories data
      apiCache.set(cacheKey, data);
      
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Not setting error state to allow products to still display
    }
  }, [BACKEND_URL]);

  // Load initial data
  useEffect(() => {
    // Fetch both in parallel
    Promise.all([
      fetchProducts(),
      fetchCategories()
    ]).catch(err => {
      console.error('Error loading initial data:', err);
    });
  }, [fetchProducts, fetchCategories]);

  // Filter products based on category and search term
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Apply category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }
        
        // Apply search filter if there is a search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        switch (sortOption) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
  }, [products, selectedCategory, searchTerm, sortOption]);

  // Handle category change
  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Handle search input
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  // Add to cart handler
  const handleAddToCart = useCallback((product) => {
    addToCart({ ...product, quantity: 1 });
  }, [addToCart]);

  // Loading state UI
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
          <div className="progress mt-2" style={{height: '4px'}}>
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading products</h4>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={() => fetchProducts(true)}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Our Products</h2>
      
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className="bi bi-filter"></i>
            </span>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.category}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className="bi bi-sort-down"></i>
            </span>
            <select
              className="form-select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default Sorting</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center my-5 p-5 bg-light rounded">
          <i className="bi bi-search" style={{fontSize: '3rem'}}></i>
          <h3 className="mt-3">No products found</h3>
          <p className="text-muted">Try adjusting your filters or search criteria</p>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortOption('default');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 product-card shadow-sm">
                <div className="position-relative">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '180px', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                        e.target.onerror = null;
                      }}
                    />
                  </Link>
                  {product.rating && (
                    <div className="position-absolute top-0 end-0 bg-warning text-dark p-2 m-2 rounded-pill">
                      <i className="bi bi-star-fill me-1"></i>
                      {product.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                      {product.name}
                    </Link>
                  </h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {product.description?.substring(0, 80)}
                    {product.description?.length > 80 ? '...' : ''}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <span className="text-success fw-bold">${Number(product.price).toFixed(2)}</span>
                      <span className="text-muted small ms-2">{product.restaurant}</span>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="bi bi-cart-plus"></i> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Products.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Products; 