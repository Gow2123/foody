import { useState, useEffect } from 'react';
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

function Product({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Ensure slash for fetch
        const response = await fetch(`${BACKEND_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  if (!product) return <div className="text-center mt-5">Product not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.image} 
            alt={product.name} 
            className="img-fluid rounded"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted mb-4">{product.description}</p>
          
          <div className="mb-4">
            <h4 className="text-danger">${product.price.toFixed(2)}</h4>
            <div className="d-flex align-items-center mb-3">
              <span className="text-warning me-2">★</span>
              <span className="me-3">{product.rating}</span>
              <span className="text-muted">•</span>
              <span className="ms-3">{product.deliveryTime} delivery</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Quantity:</label>
            <div className="input-group" style={{ width: '150px' }}>
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                className="form-control text-center" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button 
            className="btn btn-danger w-100"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

Product.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Product; 