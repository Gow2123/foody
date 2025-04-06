// Signup component with colorful design
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Determine backend URL based on environment
let backendUrl;
if (import.meta.env.VITE_BACKEND_URL) {
  backendUrl = import.meta.env.VITE_BACKEND_URL;
} else if (import.meta.env.DEV) {
  backendUrl = 'http://localhost:3000'; // Default for local development
} else {
  backendUrl = 'https://foody-backend0.vercel.app'; // Default for production build
}
const BACKEND_URL = backendUrl.replace(/\/$/, '');

function Signup({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful, store token and redirect to login
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-3 pt-2">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow border-0" style={{background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"}}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <img src="https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1480&auto=format&fit=crop" className="img-fluid rounded-circle border border-danger border-3 mb-3" width="100" height="100" style={{objectFit: "cover"}} alt="Logo" />
                <h2 className="text-danger fw-bold">Create Account</h2>
                <p className="text-muted">Join Foody and discover delicious meals!</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-bold text-dark">Username</label>
                  <input 
                    type="text" 
                    className="form-control border-danger" 
                    id="username" 
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold text-dark">Password</label>
                  <input 
                    type="password" 
                    className="form-control border-danger" 
                    id="password" 
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-bold text-dark">Confirm Password</label>
                  <input 
                    type="password" 
                    className="form-control border-danger" 
                    id="confirmPassword" 
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-danger btn-lg fw-bold">SIGN UP</button>
                </div>
                <div className="text-center mt-4">
                  <p>Already have an account? <a href="#" className="text-danger fw-bold text-decoration-none" onClick={() => navigate('/login')}>Login</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="position-relative mb-4">
            <img src="https://images.unsplash.com/photo-1515669097368-22e68427d265?q=80&w=1470&auto=format&fit=crop" className="img-fluid rounded shadow" alt="Join Banner" />
            <div className="position-absolute top-50 end-0 translate-middle-y bg-danger text-white p-3 rounded-start" style={{opacity: "0.9"}}>
              <h4>Hungry?</h4>
              <p className="mb-0">We got you covered!</p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1470&auto=format&fit=crop" className="img-fluid rounded shadow" style={{height: "150px", objectFit: "cover"}} alt="Restaurants" />
            </div>
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1374&auto=format&fit=crop" className="img-fluid rounded shadow" style={{height: "150px", objectFit: "cover"}} alt="Discount" />
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="img-fluid rounded shadow mt-3" style={{height: "150px", objectFit: "cover"}} alt="Free Delivery" />
        </div>
      </div>
    </div>
  );
}

Signup.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Signup; 