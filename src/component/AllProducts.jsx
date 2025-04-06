import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
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

// Simple cache for API requests (lasts for current session)
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

// Lazy-loaded components 
const ProductGridView = lazy(() => import('./product-views/ProductGridView'));
const ProductListView = lazy(() => import('./product-views/ProductListView'));

// Fallback loading component for lazy-loaded components
const ViewLoading = () => (
  <div className="text-center p-3">
    <div className="spinner-border spinner-border-sm text-primary" role="status">
      <span className="visually-hidden">Loading view...</span>
    </div>
  </div>
);

function AllProducts({ addToCart }) {
  // Main state
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  // Filter/Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState('name_asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  // Fetch products function with caching
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'products';
    
    try {
      setLoadingMessage('Loading products...');
      
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
          console.log('Using cached products data');
          setAllProducts(cachedData);
          // Still fetch restaurants, but don't need to wait
          extractRestaurantsFromProducts(cachedData);
          setLoading(false);
          return;
        }
      }
      
      // Not in cache or force refresh, fetch from API
      const productsRes = await fetch(`${BACKEND_URL}/products`, {
        cache: 'default', // Use browser's standard cache
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!productsRes.ok) {
        throw new Error(`Failed to fetch products: ${productsRes.status}`);
      }
      
      const productsData = await productsRes.json();
      
      // Filter for actual products (exclude categories/restaurants)
      const actualProducts = productsData.filter(p => !p.type || p.type === 'product');
      
      // Cache the filtered products
      apiCache.set(cacheKey, actualProducts);
      
      setAllProducts(actualProducts);
      
      // Extract restaurants for filtering
      extractRestaurantsFromProducts(actualProducts);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);
  
  // Extract restaurant data from products - separate function to reuse
  const extractRestaurantsFromProducts = useCallback((products) => {
    const uniqueRestaurants = [...new Set(products.map(p => p.restaurant))].filter(Boolean);
    const restaurantObjects = uniqueRestaurants.map(name => ({
      _id: name,
      name: name,
      value: name
    }));
    setRestaurants([{ _id: 'all', name: 'All Restaurants', value: 'all' }, ...restaurantObjects]);
    
    // Find max price for range filter
    const maxPrice = Math.max(...products.map(p => p.price), 100);
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, []);

  // Fetch categories with caching
  const fetchCategories = useCallback(async () => {
    const cacheKey = 'categories';
    
    try {
      setLoadingMessage('Loading categories...');
      
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        console.log('Using cached categories data');
        setCategories([{ _id: 'all', name: 'All Categories', category: 'all' }, ...cachedData]);
        return;
      }
      
      const categoriesRes = await fetch(`${BACKEND_URL}/products/categories`, {
        cache: 'default',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!categoriesRes.ok) {
        throw new Error(`Failed to fetch categories: ${categoriesRes.status}`);
      }
      
      const categoriesData = await categoriesRes.json();
      
      // Cache the categories data
      apiCache.set(cacheKey, categoriesData);
      
      setCategories([{ _id: 'all', name: 'All Categories', category: 'all' }, ...categoriesData]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Not setting error state here to allow products to still show
    }
  }, [BACKEND_URL]);

  // Initial data loading
  useEffect(() => {
    // Initiate both fetches in parallel
    Promise.all([
      fetchProducts(),
      fetchCategories()
    ]).catch(err => {
      console.error('Error during initial data loading:', err);
      setError('Failed to load initial data. Please try again.');
    });
    
    // Prefetch lazy-loaded components
    const prefetchViews = async () => {
      try {
        // This imports them but doesn't render yet
        await import('./product-views/ProductGridView');
        await import('./product-views/ProductListView');
      } catch (e) {
        console.error('Error prefetching views:', e);
      }
    };
    prefetchViews();
  }, [fetchProducts, fetchCategories]);

  // Memoized filtering and sorting logic
  const applyFiltersAndSort = useCallback(() => {
    if (allProducts.length === 0) return [];
    
    let productsToDisplay = [...allProducts];

    // Filter by search term (name or description)
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchTermLower) ||
        (product.description && product.description.toLowerCase().includes(searchTermLower))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      productsToDisplay = productsToDisplay.filter(product => product.category === selectedCategory);
    }

    // Filter by restaurant
    if (selectedRestaurant !== 'all') {
      productsToDisplay = productsToDisplay.filter(product => product.restaurant === selectedRestaurant);
    }

    // Filter by price range
    productsToDisplay = productsToDisplay.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by minimum rating
    if (ratingFilter > 0) {
      productsToDisplay = productsToDisplay.filter(product => 
        (product.rating || 0) >= ratingFilter
      );
    }

    // Sort products
    return productsToDisplay.sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating_asc':
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    });
  }, [allProducts, searchTerm, selectedCategory, selectedRestaurant, priceRange, ratingFilter, sortOption]);

  // Apply filters and sorting when dependencies change, using memoization
  useEffect(() => {
    const filteredResults = applyFiltersAndSort();
    setFilteredProducts(filteredResults);
    setCurrentPage(1); // Reset to first page when filters change
  }, [applyFiltersAndSort]);

  // Memoize the current page of products to prevent recalculation
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Memoize total pages calculation
  const totalPages = useMemo(() => 
    Math.ceil(filteredProducts.length / productsPerPage),
    [filteredProducts.length, productsPerPage]
  );

  // Change page handler
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of product list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedRestaurant('all');
    setPriceRange({ min: 0, max: Math.max(...allProducts.map(p => p.price), 100) });
    setRatingFilter(0);
    setSortOption('name_asc');
    setCurrentPage(1);
  }, [allProducts]);

  // Add to cart handler
  const handleAddToCart = useCallback((product) => {
    addToCart({ ...product, quantity: 1 });
  }, [addToCart]);

  // Memoize active filters for display
  const activeFilters = useMemo(() => {
    return [
      searchTerm && 'Search',
      selectedCategory !== 'all' && 'Category',
      selectedRestaurant !== 'all' && 'Restaurant',
      ratingFilter > 0 && 'Rating',
      (priceRange.min > 0 || priceRange.max < Math.max(...allProducts.map(p => p.price), 100)) && 'Price'
    ].filter(Boolean).join(', ') || 'None';
  }, [searchTerm, selectedCategory, selectedRestaurant, ratingFilter, priceRange, allProducts]);

  // Loading and error states
  if (loading) return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">{loadingMessage}</p>
        <div className="progress mt-2" style={{height: '4px'}}>
          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: '100%'}}></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">
        <h4>Error loading products</h4>
        <p>{error}</p>
        <button className="btn btn-primary mt-2" onClick={() => fetchProducts(true)}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Products <small className="text-muted fs-6">({filteredProducts.length})</small></h1>
        <div className="btn-group">
          <button 
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('grid')}
          >
            <i className="bi bi-grid"></i> Grid
          </button>
          <button 
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('list')}
          >
            <i className="bi bi-list"></i> List
          </button>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
              <h5 className="mb-0">Filters</h5>
              <button className="btn btn-sm btn-light" onClick={resetFilters}>Reset</button>
            </div>
            <div className="card-body">
              {/* Search Filter */}
              <div className="mb-3">
                <label htmlFor="search" className="form-label">Search</label>
                <input
                  id="search"
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.category}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Restaurant Filter */}
              <div className="mb-3">
                <label htmlFor="restaurant" className="form-label">Restaurant</label>
                <select
                  id="restaurant"
                  className="form-select"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                >
                  {restaurants.map(rest => (
                    <option key={rest._id} value={rest.value}>{rest.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-3">
                <label className="form-label">Price Range: ${priceRange.min} - ${priceRange.max}</label>
                <div className="d-flex gap-2">
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max={Math.max(...allProducts.map(p => p.price), 100)}
                    step="1"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-3">
                <label className="form-label">Minimum Rating: {ratingFilter} ★</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                />
              </div>
              
              {/* Sort Options */}
              <div className="mb-3">
                <label htmlFor="sortOption" className="form-label">Sort By</label>
                <select
                  id="sortOption"
                  className="form-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="rating_desc">Rating (High to Low)</option>
                  <option value="rating_asc">Rating (Low to High)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Filter Stats */}
          <div className="card mt-3">
            <div className="card-body">
              <p className="mb-1">Products found: <strong>{filteredProducts.length}</strong></p>
              <p className="mb-0">Active filters: <strong>{activeFilters}</strong></p>
            </div>
          </div>
        </div>
        
        {/* Products Main Content */}
        <div className="col-md-9">
          {/* Results Summary */}
          <div className="alert alert-light mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{filteredProducts.length}</strong> products found
                {selectedCategory !== 'all' && ` in "${categories.find(c => c.category === selectedCategory)?.name}"`}
                {selectedRestaurant !== 'all' && ` from "${restaurants.find(r => r.value === selectedRestaurant)?.name}"`}
              </div>
              <div>
                Page {currentPage} of {totalPages || 1}
              </div>
            </div>
          </div>
          
          {/* No Products Message */}
          {filteredProducts.length === 0 ? (
            <div className="text-center my-5 p-5 bg-light rounded">
              <i className="bi bi-search" style={{fontSize: '3rem'}}></i>
              <h3 className="mt-3">No products found</h3>
              <p className="text-muted">Try adjusting your filters or search criteria</p>
              <button className="btn btn-primary" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <Suspense fallback={<ViewLoading />}>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <ProductGridView 
                  products={currentProducts} 
                  handleAddToCart={handleAddToCart} 
                />
              )}
              
              {/* List View */}
              {viewMode === 'list' && (
                <ProductListView 
                  products={currentProducts} 
                  handleAddToCart={handleAddToCart} 
                />
              )}
            </Suspense>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(1)}>First</button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                </li>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Calculate page numbers to show around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginate(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(totalPages)}>Last</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

AllProducts.propTypes = {
  addToCart: PropTypes.func.isRequired,
};

export default AllProducts; 