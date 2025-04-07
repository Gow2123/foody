#!/bin/bash

# Deployment helper script for Foody App

echo "=============================================="
echo "Foody App Deployment Helper"
echo "=============================================="

# Clean up any unnecessary files
echo "Cleaning up node_modules..."
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Install dependencies without optional packages
echo "Installing frontend dependencies..."
cd frontend
npm ci --omit=optional
cd ..

echo "Installing backend dependencies..."
cd backend
npm ci --omit=optional
cd ..

# Run builds
echo "Building frontend..."
cd frontend
ROLLUP_SKIP_NODE_RESOLVE=true npm run build
cd ..

echo "Deployment preparation completed!"
echo "=============================================="
echo "To deploy to Vercel:"
echo "1. Commit and push your changes to GitHub"
echo "2. Run: vercel --prod"
echo "==============================================" 