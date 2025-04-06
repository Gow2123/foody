import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BACKEND_URL = 'http://localhost:3000';

function AllProducts({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Fetch products
    fetch(`${BACKEND_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.filter(p => p.image && p.type === 'product'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  // Simple filter based on search
  const filteredProducts = searchTerm === '' 
    ? products 
    : products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Add to cart
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

  return (
    <div className="container mt-4">
      <h1>All Products</h1>
      
      {/* Search box */}
      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Products grid */}
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card">
              <img src={product.image} alt={product.name} className="card-img-top" />
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
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="alert alert-info">No products found</div>
      )}
    </div>
  );
}

AllProducts.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default AllProducts; 