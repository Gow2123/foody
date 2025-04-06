// Enhanced Categories component with better visuals and information

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../config';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("Fetching categories from:", BACKEND_URL);
    fetch(`${BACKEND_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        console.log(`Found ${data.length} categories`);
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>Food Categories</h1>
      
      {categories.length === 0 ? (
        <div className="alert alert-info">No categories available</div>
      ) : (
        <div className="row">
          {categories.map(category => (
            <div key={category._id} className="col-md-4 mb-4">
              <div className="card">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="card-img-top" 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{category.name}</h5>
                  <Link to={`/products/category/${category._id}`} className="btn btn-primary">
                    Browse {category.name}
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