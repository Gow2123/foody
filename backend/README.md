# Foody Backend API

Backend API for the Foody food delivery application.

## Deployment to Vercel

This backend is configured to be deployed on Vercel as a serverless API.

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `production` for production deployment

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the following build settings:
   - Build Command: `cd backend && npm install`
   - Output Directory: `backend`
   - Install Command: `npm install`
   - Framework Preset: `Other`

### Local Development

To run the backend locally:

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Create a `.env` file with the variables from `.env.example`
4. Install dependencies: `npm install`
5. Start the development server: `npm run dev`

## API Routes

- `/api/vendor` - Vendor management routes
- `/api/firm` - Firm management routes
- `/api/product` - Product management routes
- `/api/user` - User management routes
- `/status` - Health check endpoint

## Project Structure

- `index.js` - Main application entry point
- `api/index.js` - Serverless function handler for Vercel
- `routes/` - API route handlers
- `models/` - Mongoose data models
- `controllers/` - Business logic for routes
- `uploads/` - Static file storage 