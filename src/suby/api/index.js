// API URLs for the application
export const API_URL = 'http://localhost:4000';

// Helper function to create authorization header
export const authHeader = () => {
  const token = localStorage.getItem('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}; 