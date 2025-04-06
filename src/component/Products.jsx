import { useState, useEffect } from 'react';
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

function Products({ addToCart }) {
  const [allProducts, setAllProducts] = useState([]); // Raw list from fetch/socket
  const [filteredProducts, setFilteredProducts] = useState([]); // List after filtering/sorting
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter/Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc'); // e.g., 'price_asc', 'price_desc', 'name_asc', 'name_desc'

  // Fetch products function that can be reused
  const fetchProducts = async () => {
    try {
      const productsRes = await fetch(`${BACKEND_URL}/products`);
      
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      
      const productsData = await productsRes.json();
      
      // Filter for actual products (exclude categories/restaurants if they exist in the main products endpoint)
      const actualProducts = productsData.filter(p => !p.type || p.type === 'product');
      
      setAllProducts(actualProducts);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch initial data (products and categories)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        await fetchProducts();
        
        // Fetch categories
        const categoriesRes = await fetch(`${BACKEND_URL}/products/categories`);
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        
        const categoriesData = await categoriesRes.json();
        setCategories([{ _id: 'all', name: 'All Categories', category: 'all' }, ...categoriesData]); // Add 'All' option
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for products every 30 seconds
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 30000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let productsToDisplay = [...allProducts];

    // Filter by search term (name or description)
    if (searchTerm) {
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      productsToDisplay = productsToDisplay.filter(product => product.category === selectedCategory);
    }

    // Sort products
    productsToDisplay.sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'rating_desc': // Assuming rating exists
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(productsToDisplay);

  }, [searchTerm, selectedCategory, sortOption, allProducts]);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  if (loading) return <div className="container mt-5 text-center">Loading products...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Our Products</h1>

      {/* Filters and Sorting Row */}
      <div className="row mb-4 g-3 align-items-center bg-light p-3 rounded border">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat._id} value={cat.category}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name_asc">Sort by Name (A-Z)</option>
            <option value="name_desc">Sort by Name (Z-A)</option>
            <option value="price_asc">Sort by Price (Low to High)</option>
            <option value="price_desc">Sort by Price (High to Low)</option>
            <option value="rating_desc">Sort by Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center my-5">
          <h3>No products found matching your criteria.</h3>
          <p className="text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-success">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img 
                    src={product.image} 
                    className="card-img-top"
                    alt={product.name} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop"; // Default food item
                      e.target.onerror = null;
                    }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted flex-grow-1">{product.description.substring(0, 100)}{product.description.length > 100 ? '...' : ''}</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <h5 className="text-success mb-0 fw-bold">${product.price.toFixed(2)}</h5>
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
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
  addToCart: PropTypes.func.isRequired,
};

export default Products; 