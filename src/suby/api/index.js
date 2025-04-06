// API URLs for the application
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use environment-based API URLs
export const API_URL = isDevelopment 
  ? 'http://localhost:4000' 
  : 'https://foody-backend0.vercel.app';

console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('Using API URL:', API_URL);

// Helper function to create authorization header
export const authHeader = () => {
  const token = localStorage.getItem('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}; 