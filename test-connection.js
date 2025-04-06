const fetch = require('node-fetch');

const testBackendConnection = async () => {
  try {
    console.log('Testing Backend API connection...');
    const response = await fetch('http://localhost:4000/status');
    const data = await response.json();
    console.log('✅ Backend API is running!');
    console.log(data);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Backend API:', error.message);
    return false;
  }
};

const testVendorEndpoint = async () => {
  try {
    console.log('\nTesting Vendor endpoint...');
    const response = await fetch('http://localhost:4000/vendor/test');
    const data = await response.json();
    console.log('✅ Vendor API endpoint is working!');
    console.log(data);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Vendor API endpoint:', error.message);
    return false;
  }
};

const testFullFlow = async () => {
  const backendOk = await testBackendConnection();
  if (!backendOk) {
    console.log('\n⚠️ Backend connection failed. Please make sure your backend server is running on port 4000.');
    return;
  }
  
  const vendorOk = await testVendorEndpoint();
  if (!vendorOk) {
    console.log('\n⚠️ Vendor endpoint test failed. This is needed for authentication.');
    return;
  }
  
  console.log('\n✅ All connections are working properly!');
  console.log('\nYou can now use the following apps:');
  console.log('- Backend: http://localhost:4000');
  console.log('- Admin: Check your running terminal for the URL (likely http://localhost:5175)');
  console.log('- Frontend: Check your running terminal for the URL');
};

// Run the tests
testFullFlow(); 