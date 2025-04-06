import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductGridView = ({ products, handleAddToCart }) => {
  return (
    <div className="row">
      {products.map(product => (
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
  );
};

ProductGridView.propTypes = {
  products: PropTypes.array.isRequired,
  handleAddToCart: PropTypes.func.isRequired
};

export default ProductGridView; 