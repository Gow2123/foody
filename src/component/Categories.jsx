// Enhanced Categories component with better visuals and information

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Simple backend URL config
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://foody-backend0.vercel.app');

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Try main API endpoint with fallback
        let response = await fetch(`${BACKEND_URL}/api/categories`);
        if (!response.ok) {
          response = await fetch(`${BACKEND_URL}/products/categories`);
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.filter(category => category.image));
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading state
  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div><p>Loading...</p></div>;
  
  // Error state
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Food Categories</h1>
      
      {categories.length === 0 ? (
        <div className="alert alert-info">No categories found</div>
      ) : (
        <div className="row">
          {categories.map(category => (
            <div key={category._id} className="col-md-4 col-lg-3 mb-4">
              <div className="card h-100">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                    e.target.onerror = null;
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text small">{category.description}</p>
                  <Link to={`/category/${category._id}`} className="btn btn-primary">
                    Browse Products
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories; 