import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    // Show loading indicator while checking auth status
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" />;
  }
  
  return children;
};

export default ProtectedRoute; 