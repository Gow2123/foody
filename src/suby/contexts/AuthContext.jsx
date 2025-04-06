import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Define API URL directly here as a fallback
const API_BASE_URL = 'http://localhost:4000';
const API_PREFIX = '/api';

// Import from api file
import { API_URL as importedApiUrl } from '../api';

// Create auth context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Make sure we have a valid API URL
  const API_URL = importedApiUrl || `${API_BASE_URL}${API_PREFIX}`;
  
  // Log the API URL at initialization
  console.log('AuthContext initialized with API_URL:', API_URL);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      
      console.log('Checking auth with token:', token ? 'exists' : 'none', 'and userId:', userId);
      
      if (token && userId) {
        try {
          // Verify token is valid by fetching user data
          const userEndpoint = `${API_URL}/user/${userId}`;
          console.log('Fetching user data from:', userEndpoint);
          
          const response = await axios.get(userEndpoint, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('User data response:', response.data);
          
          if (response.data.success) {
            setUser(response.data.user);
            setIsLoggedIn(true);
            console.log('User authenticated successfully');
          } else {
            console.log('Token valid but response unsuccessful');
            logout();
          }
        } catch (error) {
          console.error('Auth check error:', error);
          logout();
        }
      } else {
        console.log('No token or userId found');
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [API_URL]);

  // Login function
  const login = async (username, password) => {
    try {
      const loginEndpoint = `${API_URL}/user/login`;
      console.log('AuthContext: Sending login request to', loginEndpoint);
      
      const response = await axios.post(loginEndpoint, {
        username,
        password
      });
      
      console.log('AuthContext: Login response received:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to localStorage
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', user._id);
        localStorage.setItem('username', user.username);
        
        // Update state
        setUser(user);
        setIsLoggedIn(true);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user');
    // Clear all auth-related localStorage items
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    // Reset state
    setIsLoggedIn(false);
    setUser(null);
    console.log('User logged out successfully');
  };

  // Auth context value
  const value = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 