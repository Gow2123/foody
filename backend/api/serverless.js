// Handler for Vercel serverless deployment
const app = require('../index');

// Vercel serverless function handler
module.exports = (req, res) => {
  // Handle the request with the main Express app
  return app(req, res);
}; 