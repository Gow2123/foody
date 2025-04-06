import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductListView = ({ products, handleAddToCart }) => {
  return (
    <div className="list-group">
      {products.map(product => (
        <div key={product._id} className="list-group-item list-group-item-action p-3 mb-2 shadow-sm">
          <div className="row align-items-center">
            <div className="col-md-2">
              <Link to={`/product/${product._id}`}>
                <img 
                  src={product.image} 
                  className="img-fluid rounded"
                  alt={product.name} 
                  style={{ height: '100px', objectFit: 'cover' }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                    e.target.onerror = null;
                  }}
                />
              </Link>
            </div>
            <div className="col-md-6">
              <h5>
                <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                  {product.name}
                </Link>
              </h5>
              <p className="text-muted mb-1 small">
                {product.description?.substring(0, 100)}
                {product.description?.length > 100 ? '...' : ''}
              </p>
              <div>
                <span className="badge bg-secondary me-1">{product.category}</span>
                <span className="badge bg-info">{product.restaurant}</span>
              </div>
            </div>
            <div className="col-md-2 text-center">
              <div className="mb-1">
                <span className="fw-bold">${Number(product.price).toFixed(2)}</span>
              </div>
              {product.rating && (
                <div className="text-warning small">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i 
                      key={i} 
                      className={`bi ${i < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'}`}
                    ></i>
                  ))}
                </div>
              )}
            </div>
            <div className="col-md-2 text-end">
              <button 
                className="btn btn-outline-primary"
                onClick={() => handleAddToCart(product)}
              >
                <i className="bi bi-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ProductListView.propTypes = {
  products: PropTypes.array.isRequired,
  handleAddToCart: PropTypes.func.isRequired
};

export default ProductListView; 