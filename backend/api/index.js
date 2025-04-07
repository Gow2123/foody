// Serverless function handler for Vercel
const app = require('../index');

// Export the Express app as a serverless function
module.exports = (req, res) => {
  // Forward request to Express app
  return app(req, res);
}; 