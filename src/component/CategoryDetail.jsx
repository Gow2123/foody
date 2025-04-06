import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// Use environment variable for backend URL with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function CategoryDetail({ addToCart }) {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching category ${id} from: ${BACKEND_URL}`);
    
    // Fetch category details and products in this category
    fetch(`${BACKEND_URL}/api/categories/${id}`)
      .then(res => res.json())
      .then(data => {
        setCategory(data);
        return fetch(`${BACKEND_URL}/api/products/category/${id}`);
      })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching category data:", err);
        setLoading(false);
      });
  }, [id]);

  // Add to cart handler
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
  if (!category) return <div className="container mt-5">Category not found</div>;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1>{category.name}</h1>
        {category.description && <p className="lead">{category.description}</p>}
      </div>

      <h2>Products</h2>
      {products.length === 0 ? (
        <div className="alert alert-info">No products available in this category</div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
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

CategoryDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default CategoryDetail; 