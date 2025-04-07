import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Import from api file
import { API_URL } from '../api';

// Create auth context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Determine API URL - prefer environment variable if available
  const apiBaseUrl = import.meta.env.VITE_API_URL || API_URL;
  
  // Log the API URL at initialization
  console.log('AuthContext initialized with API_URL:', apiBaseUrl);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      
      console.log('Checking auth with token:', token ? 'exists' : 'none', 'and userId:', userId);
      
      if (token && userId) {
        try {
          // Verify token is valid by fetching user data
          const userEndpoint = `${apiBaseUrl}/user/${userId}`;
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
  }, [apiBaseUrl]);

  // Login function
  const login = async (username, password) => {
    try {
      const loginEndpoint = `${apiBaseUrl}/user/login`;
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
    logout,
    apiUrl: apiBaseUrl
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 