// Enhanced Categories component with better visuals and information

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:3000';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simple fetch using basic MongoDB CRUD
    fetch(`${BACKEND_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.filter(c => c.image));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>Food Categories</h1>
      
      <div className="row">
        {categories.map(category => (
          <div key={category._id} className="col-md-4 mb-4">
            <div className="card">
              <img src={category.image} alt={category.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{category.name}</h5>
                <Link to={`/category/${category._id}`} className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories; 