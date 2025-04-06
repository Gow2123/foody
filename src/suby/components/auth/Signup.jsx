import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../pages/Auth.css';
import { API_URL } from '../../api';

// Using web image for signup
const signupImage = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters long with at least one number and one special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { username, email, password, confirmPassword, phone, address } = formData;

    // Validation
    if (!username || !email || !password || !confirmPassword || !phone || !address) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with at least one number and one special character');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending registration request to:', `${API_URL}/user/register`);
      console.log('With data:', { username, email, password, phone, address });
      
      const response = await axios.post(`${API_URL}/user/register`, {
        username,
        email,
        password,
        phone,
        address
      });

      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-image">
          <img src={signupImage} alt="Food Signup" />
          <div className="auth-image-overlay"></div>
          <div className="auth-image-text">
            <h2>Join Our Food Community</h2>
            <p>Sign up to explore local restaurants and enjoy delicious meals delivered to your door</p>
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Get started with your free account</p>
            </div>
            
            {error && (
              <div className="auth-alert error">
                <span className="auth-alert-icon">!</span>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="auth-alert success">
                <span className="auth-alert-icon">✓</span>
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSignup} className="auth-form">
              <div className="signup-columns">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-with-icon">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                    />
                    <span className="input-icon">👤</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-with-icon">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                    />
                    <span className="input-icon">✉️</span>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                  />
                  <span className="input-icon">📱</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <div className="input-with-icon">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your delivery address"
                    required
                  />
                  <span className="input-icon">🏠</span>
                </div>
              </div>
              
              <div className="signup-columns">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                    <span className="input-icon">🔒</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-with-icon">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    <span className="input-icon">🔒</span>
                  </div>
                </div>
              </div>
              
              <div className="form-footer">
                <div className="remember-me">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">I agree to the Terms of Service</label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : 'Sign Up'}
              </button>
              
              <div className="auth-divider">
                <span>Or sign up with</span>
              </div>
              
              <div className="social-auth">
                <button type="button" className="social-button google">
                  <span className="social-icon">G</span>
                  <span>Google</span>
                </button>
                <button type="button" className="social-button facebook">
                  <span className="social-icon">f</span>
                  <span>Facebook</span>
                </button>
              </div>
            </form>
            
            <div className="auth-redirect">
              <p>Already have an account? <Link to="/auth">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 