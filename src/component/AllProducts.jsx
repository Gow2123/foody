import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../config';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    console.log("Fetching products from:", BACKEND_URL);
    fetch(`${BACKEND_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        console.log(`Found ${data.length} products`);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);
  
  // Filter results
  const filteredProducts = products.filter(product => 
    searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>All Products</h1>
      
      {/* Search */}
      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div className="alert alert-info">No products found</div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                  <Link to={`/product/${product._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProducts; 