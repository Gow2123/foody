// Food cards using Bootstrap card templates
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FoodCards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;

  // Get products by category
  const pizzaProducts = products.filter(p => p.category === 'pizza');
  const burgerProducts = products.filter(p => p.category === 'burgers');
  const sushiProducts = products.filter(p => p.category === 'sushi');

  return (
    <div className="container mt-3 pt-2">
      <h2 className="mb-3 text-danger fw-bold">Popular Restaurants</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {pizzaProducts.slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "200px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">{product.restaurant}</h5>
                <p className="card-text">{product.description}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <small className="text-danger fw-bold">{product.rating} ★ • {product.deliveryTime}</small>
              </div>
            </div>
          </div>
        ))}
        {burgerProducts.slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "200px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">{product.restaurant}</h5>
                <p className="card-text">{product.description}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <small className="text-danger fw-bold">{product.rating} ★ • {product.deliveryTime}</small>
              </div>
            </div>
          </div>
        ))}
        {sushiProducts.slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "200px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">{product.restaurant}</h5>
                <p className="card-text">{product.description}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <small className="text-danger fw-bold">{product.rating} ★ • {product.deliveryTime}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-4 text-danger fw-bold">Featured Deals</h2>
      <div className="row">
        {pizzaProducts.slice(1, 2).map(product => (
          <div className="col-md-6 mb-3" key={product._id}>
            <div className="card shadow border-0">
              <div className="row g-0">
                <div className="col-md-4">
                  <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <img src={product.image} 
                      className="img-fluid rounded-start" 
                      style={{height: "100%", objectFit: "cover"}} 
                      alt={product.name} 
                    />
                  </Link>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <Link to={`/product/${product._id}`} className="btn btn-danger">Order Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {burgerProducts.slice(1, 2).map(product => (
          <div className="col-md-6 mb-3" key={product._id}>
            <div className="card shadow border-0">
              <div className="row g-0">
                <div className="col-md-4">
                  <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <img src={product.image} 
                      className="img-fluid rounded-start" 
                      style={{height: "100%", objectFit: "cover"}} 
                      alt={product.name} 
                    />
                  </Link>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <Link to={`/product/${product._id}`} className="btn btn-danger">Order Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-4 text-danger fw-bold">Popular Cuisine Categories</h2>
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {pizzaProducts.slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card text-center h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "150px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">Pizza</h5>
                <Link to={`/product/${product._id}`} className="btn btn-outline-danger">Browse</Link>
              </div>
            </div>
          </div>
        ))}
        {burgerProducts.slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card text-center h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "150px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">Burgers</h5>
                <Link to={`/product/${product._id}`} className="btn btn-outline-danger">Browse</Link>
              </div>
            </div>
          </div>
        ))}
        {sushiProducts.slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card text-center h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "150px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">Sushi</h5>
                <Link to={`/product/${product._id}`} className="btn btn-outline-danger">Browse</Link>
              </div>
            </div>
          </div>
        ))}
        {products.filter(p => p.category === 'desserts').slice(0, 1).map(product => (
          <div className="col" key={product._id}>
            <div className="card text-center h-100 shadow border-0">
              <Link to={`/product/${product._id}`} className="text-decoration-none">
                <img src={product.image} 
                  className="card-img-top" 
                  style={{height: "150px", objectFit: "cover"}} 
                  alt={product.name} 
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title fw-bold">Desserts</h5>
                <Link to={`/product/${product._id}`} className="btn btn-outline-danger">Browse</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodCards; 