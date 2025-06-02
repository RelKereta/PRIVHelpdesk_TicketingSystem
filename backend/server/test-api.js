const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Test data
const testTicket = {
  subject: "Test Ticket",
  description: "This is a test ticket",
  priority: "Medium",
  type: "Bug",
  category: "Software",
  department: "IT"
};

// Test user data
const testUser = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  firstName: "Test",
  lastName: "User",
  department: "IT",
  role: "user"
};

async function testEndpoints() {
  try {
    console.log('🔍 Testing API Endpoints...\n');

    // 1. Test Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', health.data, '\n');

    // 2. Test Ticket Creation
    console.log('2. Testing Ticket Creation...');
    const createTicket = await axios.post(`${API_URL}/tickets`, testTicket);
    console.log('✅ Ticket Created:', createTicket.data, '\n');

    // 3. Test Get All Tickets
    console.log('3. Testing Get All Tickets...');
    const getAllTickets = await axios.get(`${API_URL}/tickets`);
    console.log('✅ All Tickets:', getAllTickets.data, '\n');

    // 4. Test Get Single Ticket
    console.log('4. Testing Get Single Ticket...');
    const ticketId = createTicket.data._id;
    const getTicket = await axios.get(`${API_URL}/tickets/${ticketId}`);
    console.log('✅ Single Ticket:', getTicket.data, '\n');

    // 5. Test Update Ticket
    console.log('5. Testing Update Ticket...');
    const updateData = { priority: 'High' };
    const updateTicket = await axios.patch(`${API_URL}/tickets/${ticketId}`, updateData);
    console.log('✅ Updated Ticket:', updateTicket.data, '\n');

    // 6. Test Add Comment
    console.log('6. Testing Add Comment...');
    const commentData = { text: 'This is a test comment' };
    const addComment = await axios.post(`${API_URL}/tickets/${ticketId}/comments`, commentData);
    console.log('✅ Added Comment:', addComment.data, '\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testEndpoints(); 