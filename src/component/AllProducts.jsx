import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Simple backend URL config
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://foody-backend0.vercel.app');

function AllProducts({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // Fetch products and categories
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsRes = await fetch(`${BACKEND_URL}/products`);
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        
        // Fetch categories for filter options
        let categoriesRes = await fetch(`${BACKEND_URL}/api/categories`);
        if (!categoriesRes.ok) {
          categoriesRes = await fetch(`${BACKEND_URL}/products/categories`);
        }
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        // Filter out items without images
        const filteredProducts = productsData.filter(
          product => product.image && product.type === 'product'
        );
        
        setProducts(filteredProducts);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter dropdown
  const uniqueCategories = ['all', ...new Set(products.map(product => product.category))];
  
  // Handle adding product to cart
  const handleAddToCart = (product) => {
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Products</h1>
      
      {/* Search and filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <select 
            className="form-select" 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Product results */}
      {filteredProducts.length === 0 ? (
        <div className="alert alert-info">No products found</div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                    e.target.onerror = null;
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text small">{product.description}</p>
                  <p className="card-text">
                    <small className="text-muted">Category: {product.category}</small>
                  </p>
                  <p className="card-text">${product.price.toFixed(2)}</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

AllProducts.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default AllProducts; 