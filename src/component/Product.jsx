import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// Use environment variable for backend URL with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function Product({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log(`Fetching product ${id} from: ${BACKEND_URL}`);
    fetch(`${BACKEND_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setError(err.message);
        setLoading(false);
      });
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

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">Error: {error}</div>;
  if (!product) return <div className="container mt-5">Product not found</div>;

  return (
    <div className="container mt-4">
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
          <h1>{product.name}</h1>
          <p className="lead">{product.description}</p>
          <p className="fs-4 fw-bold">${product.price.toFixed(2)}</p>
          
          {product.inStock ? (
            <span className="badge bg-success mb-3">In Stock</span>
          ) : (
            <span className="badge bg-danger mb-3">Out of Stock</span>
          )}
          
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

          <div>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Product.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Product; 