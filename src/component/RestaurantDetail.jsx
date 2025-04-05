import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndProducts = async () => {
      try {
        const [restaurantResponse, productsResponse] = await Promise.all([
          fetch(`http://localhost:3000/products/restaurant/${id}`),
          fetch(`http://localhost:3000/products/restaurant/${id}/products`)
        ]);

        if (!restaurantResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch restaurant data');
        }

        const [restaurantData, productsData] = await Promise.all([
          restaurantResponse.json(),
          productsResponse.json()
        ]);

        // Filter out products without images
        const filteredProducts = productsData.filter(product => product.image);

        setRestaurant(restaurantData);
        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndProducts();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  if (!restaurant) return <div className="text-center mt-5">Restaurant not found</div>;

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-4">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="img-fluid rounded"
            style={{ width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Replace with a default restaurant image
              e.target.src = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1374&auto=format&fit=crop";
              e.target.onerror = null; // Prevent infinite loops
            }}
          />
        </div>
        <div className="col-md-8">
          <h2>{restaurant.name}</h2>
          <p className="text-muted">{restaurant.description}</p>
          <div className="d-flex align-items-center">
            <span className="text-warning me-2">★</span>
            <span className="me-3">{restaurant.rating}</span>
            <span className="text-muted">•</span>
            <span className="ms-3">{restaurant.deliveryTime} delivery</span>
          </div>
        </div>
      </div>

      <h3 className="mb-4">Menu</h3>
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

RestaurantDetail.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default RestaurantDetail; 