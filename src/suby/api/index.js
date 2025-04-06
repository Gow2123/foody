// API URLs for the application
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('192.168.');

// Use environment-based API URLs
export const API_URL = isLocalhost 
  ? 'http://localhost:4000' 
  : 'https://foody-backend0.vercel.app';

console.log('Running environment:', isLocalhost ? 'Local development' : 'Production deployment');
console.log('Using API URL:', API_URL);

// Helper function to create authorization header
export const authHeader = () => {
  const token = localStorage.getItem('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}; 