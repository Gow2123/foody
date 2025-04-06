import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Use environment variable for backend URL with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Basic data fetching
    const fetchData = async () => {
      try {
        console.log("Fetching data from:", BACKEND_URL);
        const productsRes = await fetch(`${BACKEND_URL}/api/products`);
        const restaurantsRes = await fetch(`${BACKEND_URL}/api/restaurants`);
        
        const productsData = await productsRes.json();
        const restaurantsData = await restaurantsRes.json();
        
        setProducts(productsData.filter(product => product.image));
        setRestaurants(restaurantsData.filter(restaurant => restaurant.image));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simple add to cart
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
    <div className="container mt-3">
      {/* Hero Section */}
      <div className="bg-light p-4 rounded mb-4">
        <h1>Food Delivery</h1>
        <p>Order from restaurants in your area</p>
        <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
      </div>

      {/* Restaurants */}
      <section className="mb-4">
        <h2>Popular Restaurants</h2>
        <div className="row">
          {restaurants.slice(0, 4).map((restaurant) => (
            <div key={restaurant._id} className="col-md-3 mb-3">
              <div className="card">
                <img src={restaurant.image} alt={restaurant.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <Link to={`/restaurant/${restaurant._id}`} className="btn btn-sm btn-primary">
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mb-4">
        <h2>Popular Items</h2>
        <div className="row">
          {products.slice(0, 6).map((product) => (
            <div key={product._id} className="col-md-4 mb-3">
              <div className="card">
                <img src={product.image} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p>${product.price?.toFixed(2)}</p>
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
      </section>
    </div>
  );
}

Home.propTypes = {
  addToCart: PropTypes.func.isRequired
};

export default Home; 