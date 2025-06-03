const axios = require('axios');

// Test API endpoints
const testEndpoints = [
  'http://localhost:3014',
  'http://localhost:3014/health',
  'http://localhost:3014/api/health',
  'https://e2425-wads-l4acg7-server.csbihub.id',
  'https://e2425-wads-l4acg7-server.csbihub.id/health',
  'https://e2425-wads-l4acg7-server.csbihub.id/api/health'
];

async function testEndpoint(url) {
  try {
    console.log(`\n🔍 Testing: ${url}`);
    const response = await axios.get(url, { timeout: 5000 });
    console.log(`✅ Success - Status: ${response.status}`);
    console.log(`📄 Response:`, response.data);
  } catch (error) {
    console.log(`❌ Failed - ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting API Connection Tests...\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n✨ All tests completed!');
}

runTests().catch(console.error); 