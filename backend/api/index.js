// Serverless handler for Vercel
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const app = express();

// Config
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
// Use Vercel environment variable or fallback to local .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foody';

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Re-route all API requests to the main backend
app.all('/api/*', (req, res) => {
  // This will be handled by vercel.json rewrites to the main backend
  require('../index')(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the serverless function
module.exports = app; 