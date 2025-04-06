import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../api';
import axios from 'axios';
import './Auth.css';

// Using web image for login
const loginImage = "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1064&auto=format&fit=crop";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      // First attempt to directly call the API to test the connection
      console.log('API_URL from import:', API_URL);
      console.log('Testing direct API connection to:', `${API_URL}/user/test`);
      try {
        const testResponse = await axios.get(`${API_URL}/user/test`);
        console.log('API test response:', testResponse.data);
      } catch (testError) {
        console.error('API test failed:', testError);
      }
      
      setLoading(true);
      console.log('Attempting login with username:', username);
      
      // Manual login attempt
      try {
        console.log('Manual login attempt to:', `${API_URL}/user/login`);
        const directResponse = await axios.post(`${API_URL}/user/login`, {
          username,
          password
        });
        console.log('Direct login response:', directResponse.data);
      } catch (directError) {
        console.error('Direct login failed:', directError);
      }
      
      await login(username, password);
      console.log('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-image">
          <img src={loginImage} alt="Food Login" />
          <div className="auth-image-overlay"></div>
          <div className="auth-image-text">
            <h2>Welcome Back!</h2>
            <p>Log in to continue your culinary journey with Foody</p>
          </div>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1>Login</h1>
              <p>Sign in to access your account</p>
            </div>
            
            {error && (
              <div className="auth-alert error">
                <span className="auth-alert-icon">!</span>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <span className="input-icon">🔒</span>
                </div>
              </div>
              
              <div className="form-footer">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : 'Login'}
              </button>
              
              <div className="auth-divider">
                <span>Or sign in with</span>
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
              <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 