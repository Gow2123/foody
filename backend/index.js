const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path')

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// Load environment variables
dotEnv.config();

// Configure CORS
const allowedOrigins = [
  // Local development URLs
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175', 
  'http://localhost:5176',
  'http://localhost:5177',
  // Production URLs
  'https://foody-mern.vercel.app',
  'https://foody-admin0.vercel.app',
  // Allow any Vercel domain for development/staging environments
  'https://*.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or same-origin)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') ||
      origin.includes('vercel.app')
    ) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Connect to MongoDB - with retry logic and error handling for serverless
const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not defined');
      }
      
      console.log('Attempting MongoDB connection...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s
      });
      console.log("MongoDB connected successfully!");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      // Don't crash in production, but do in development to catch issues
      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }
    }
  }
};

// Body parser middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/status', async (req, res) => {
  try {
    // Try to connect if not already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      time: new Date().toISOString(),
      mongoConnection: 'failed',
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// API routes - make them available both with and without /api prefix
// Vendor routes
app.use('/api/vendor', vendorRoutes);
app.use('/vendor', vendorRoutes);

// Firm routes
app.use('/api/firm', firmRoutes);
app.use('/firm', firmRoutes);

// Product routes
app.use('/api/product', productRoutes);
app.use('/product', productRoutes);

// User routes
app.use('/api/user', userRoutes);
app.use('/user', userRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default route
app.get('/', (req, res) => {
  res.send("<h1>Welcome to Foody API</h1>");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message || 'Unknown error'
  });
});

// Connect to MongoDB when starting the server
connectDB();

// Start server if it's a direct Node.js execution (not being required as a module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started and running at ${PORT}`);
  });
}

// Export for serverless functions
module.exports = app;