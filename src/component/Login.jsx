// Login component with colorful design
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import BACKEND_URL from '../config';

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log(`Attempting login at: ${BACKEND_URL}/api/login`);
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      setIsLoggedIn(true);
      setSuccess('Login successful! Redirecting...');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3 pt-2">
      <div className="row">
        <div className="col-md-6 mb-4">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop" className="img-fluid rounded shadow" alt="Food Banner" />
          <div className="row mt-3">
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1471&auto=format&fit=crop" className="img-fluid rounded shadow" style={{height: "150px", objectFit: "cover"}} alt="Delivery" />
            </div>
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1470&auto=format&fit=crop" className="img-fluid rounded shadow" style={{height: "150px", objectFit: "cover"}} alt="Offers" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow border-0" style={{background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"}}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <img src="https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1480&auto=format&fit=crop" className="img-fluid rounded-circle border border-danger border-3 mb-3" width="100" height="100" style={{objectFit: "cover"}} alt="Logo" />
                <h2 className="text-danger fw-bold">Welcome Back!</h2>
                <p className="text-muted">Login to your Foody account</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-bold text-dark">Username</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg border-danger" 
                    id="username" 
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold text-dark">Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-lg border-danger" 
                    id="password" 
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-danger btn-lg fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>{"Don't"} have an account? <Link to="/register" className="text-danger fw-bold text-decoration-none">Sign Up</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Login; 