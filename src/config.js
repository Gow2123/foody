// src/config.js
// Use environment variable for backend URL, fallback to deployed URL
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'https://foody-backend0.vercel.app').replace(/\/$/, '');

export default BACKEND_URL; 