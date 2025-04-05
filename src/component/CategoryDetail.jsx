import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function CategoryDetail({ addToCart }) {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(`http://localhost:3000/products/category/${id}`),
          fetch(`http://localhost:3000/products/category/${id}/products`)
        ]);

        if (!categoryResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch category data');
        }

        const [categoryData, productsData] = await Promise.all([
          categoryResponse.json(),
          productsResponse.json()
        ]);

        // Filter out products without images
        const filteredProducts = productsData.filter(product => product.image);

        setCategory(categoryData);
        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  if (!category) return <div className="text-center mt-5">Category not found</div>;

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-4">
          <img 
            src={category.image} 
            alt={category.name} 
            className="img-fluid rounded"
            style={{ width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Replace with a default category image
              e.target.src = "https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=1470&auto=format&fit=crop";
              e.target.onerror = null; // Prevent infinite loops
            }}
          />
        </div>
        <div className="col-md-8">
          <h2>{category.name}</h2>
          <p className="text-muted">{category.description}</p>
        </div>
      </div>

      <h3 className="mb-4">Products</h3>
      <div className="row">
        {products.map(product => (
          <div key={product._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  // Replace with a default food item image
                  e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                  e.target.onerror = null; // Prevent infinite loops
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-danger mb-0">${product.price.toFixed(2)}</h5>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => addToCart({
                      _id: product._id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image,
                      quantity: 1
                    })}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

CategoryDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default CategoryDetail; 