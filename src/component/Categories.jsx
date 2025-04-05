// Enhanced Categories component with better visuals and information

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and products in parallel
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('http://localhost:3000/products/categories'),
          fetch('http://localhost:3000/products')
        ]);

        if (!categoriesRes.ok) {
          throw new Error('Failed to fetch categories');
        }
        if (!productsRes.ok) {
          throw new Error('Failed to fetch products');
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
        
        // Filter out categories with no images
        const filteredCategories = categoriesData.filter(category => category.image);
        
        setCategories(filteredCategories);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get products count for each category
  const getCategoryProductCount = (categoryName) => {
    return products.filter(product => product.category === categoryName).length;
  };

  // Function to get the most popular product in a category (highest rating)
  const getMostPopularInCategory = (categoryName) => {
    const categoryProducts = products.filter(product => product.category === categoryName && product.image);
    if (categoryProducts.length === 0) return null;
    
    return categoryProducts.reduce((prev, current) => 
      (prev.rating > current.rating) ? prev : current
    );
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;

  // Get a featured category (first one with highest product count)
  const featuredCategory = [...categories].sort((a, b) => 
    getCategoryProductCount(b.category) - getCategoryProductCount(a.category)
  )[0] || null;

  return (
    <div className="container mt-5">
      {/* Hero banner */}
      <section className="mb-5">
        <div className="card bg-dark text-white">
          <img 
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1480&auto=format&fit=crop" 
            className="card-img" 
            alt="Food Categories Banner"
            style={{ height: '350px', objectFit: 'cover', opacity: '0.7' }}
          />
          <div className="card-img-overlay d-flex align-items-center">
            <div>
              <h1 className="display-4 fw-bold">Explore Food Categories</h1>
              <p className="lead">Find your favorite cuisines and dishes</p>
            </div>
          </div>
            </div>
      </section>

      {/* Featured category section */}
      {featuredCategory && (
        <section className="mb-5">
          <h2 className="mb-4">Featured Category</h2>
          <div className="card mb-3 shadow-sm">
            <div className="row g-0">
              <div className="col-md-5">
                <img 
                  src={featuredCategory.image} 
                  alt={featuredCategory.name} 
                  className="img-fluid rounded-start h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    // Replace with a default category image
                    e.target.src = "https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=1470&auto=format&fit=crop";
                    e.target.onerror = null; // Prevent infinite loops
                  }}
                />
              </div>
              <div className="col-md-7">
                <div className="card-body d-flex flex-column h-100">
                  <div>
                    <h3 className="card-title">{featuredCategory.name}</h3>
                    <p className="card-text">{featuredCategory.description}</p>
                    <div className="mb-3">
                      <span className="badge bg-danger me-2">{getCategoryProductCount(featuredCategory.category)} Items</span>
                      <span className="badge bg-secondary me-2">Popular Choice</span>
                </div>
              </div>
              
                  {getMostPopularInCategory(featuredCategory.category) && (
                    <div className="mb-3">
                      <h5>Most Popular Item</h5>
                      <div className="d-flex align-items-center">
                        <img 
                          src={getMostPopularInCategory(featuredCategory.category).image} 
                          alt={getMostPopularInCategory(featuredCategory.category).name} 
                          className="me-3 rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => {
                            // Replace with a default food item image
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                            e.target.onerror = null;
                          }}
                        />
                        <div>
                          <h6 className="mb-0">{getMostPopularInCategory(featuredCategory.category).name}</h6>
                          <div>
                            <span className="text-warning">★</span>
                            <span className="ms-1">{getMostPopularInCategory(featuredCategory.category).rating}</span>
                    </div>
                  </div>
                </div>
              </div>
                  )}
                  
                  <div className="mt-auto">
                    <Link to={`/category/${featuredCategory._id}`} className="btn btn-danger">
                      Explore {featuredCategory.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All categories grid */}
      <section>
        <h2 className="mb-4">All Food Categories</h2>
        <div className="row">
          {categories.map(category => (
            <div key={category._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    // Replace with a default category image
                    e.target.src = "https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=1470&auto=format&fit=crop";
                    e.target.onerror = null;
                  }}
                />
                  <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{category.name}</h5>
                    <span className="badge bg-danger rounded-pill">
                      {getCategoryProductCount(category.category)} items
                    </span>
                  </div>
                  <p className="card-text text-muted">{category.description}</p>
                  
                  {/* Popular dishes in this category */}
                  {getMostPopularInCategory(category.category) && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-2">Popular in this category:</small>
                      <div className="d-flex align-items-center">
                        <img 
                          src={getMostPopularInCategory(category.category).image} 
                          alt={getMostPopularInCategory(category.category).name} 
                          className="me-2 rounded"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          onError={(e) => {
                            // Replace with a default food item image
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                            e.target.onerror = null;
                          }}
                        />
                        <div>
                          <small className="fw-bold">{getMostPopularInCategory(category.category).name}</small>
                          <div>
                            <small className="text-warning">★</small>
                            <small className="ms-1">{getMostPopularInCategory(category.category).rating}</small>
                    </div>
                  </div>
                </div>
              </div>
                  )}
                  
                  <div className="mt-auto">
                    <Link to={`/category/${category._id}`} className="btn btn-outline-danger w-100">
                      Browse {category.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category benefits */}
      <section className="my-5 bg-light p-4 rounded">
        <div className="row text-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="p-3">
              <i className="bi bi-tags fs-1 text-danger"></i>
              <h4 className="mt-3">Organized Selection</h4>
              <p className="text-muted">Browse through neatly categorized food items</p>
                    </div>
                  </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="p-3">
              <i className="bi bi-search fs-1 text-danger"></i>
              <h4 className="mt-3">Quick Discovery</h4>
              <p className="text-muted">Find your favorite cuisine type in seconds</p>
                </div>
              </div>
          <div className="col-md-4">
            <div className="p-3">
              <i className="bi bi-heart fs-1 text-danger"></i>
              <h4 className="mt-3">Personalized Recommendations</h4>
              <p className="text-muted">Get suggestions based on your preferences</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Categories; 