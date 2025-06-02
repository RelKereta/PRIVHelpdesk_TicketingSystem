const axios = require('axios');

const API_URL = 'http://localhost:3000';
let authToken = null;
let testTicketId = null;

async function runTests() {
    try {
        console.log('🚀 Starting API Tests...\n');

        // 1. Test Health Check
        console.log('1. Testing Health Check...');
        const healthResponse = await axios.get(`${API_URL}/health`);
        console.log('✅ Health Check:', healthResponse.data);

        // 2. Test User Registration
        console.log('\n2. Testing User Registration...');
        const registerResponse = await axios.post(`${API_URL}/api/users/register`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123',
            firstName: 'Test',
            lastName: 'User',
            department: 'IT',
            role: 'user'
        });
        console.log('✅ User Registration:', registerResponse.data);

        // 3. Test User Login
        console.log('\n3. Testing User Login...');
        const loginResponse = await axios.post(`${API_URL}/api/users/login`, {
            email: 'test@example.com',
            password: 'test123'
        });
        authToken = loginResponse.data.token;
        console.log('✅ User Login:', { token: authToken.substring(0, 20) + '...' });

        // 4. Test Get Current User
        console.log('\n4. Testing Get Current User...');
        const userResponse = await axios.get(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get Current User:', userResponse.data);

        // 5. Test Create Ticket
        console.log('\n5. Testing Create Ticket...');
        const createTicketResponse = await axios.post(
            `${API_URL}/api/tickets`,
            {
                subject: 'Test Ticket',
                description: 'This is a test ticket',
                priority: 'Medium',
                type: 'Bug',
                category: 'Software',
                department: 'IT'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        testTicketId = createTicketResponse.data._id;
        console.log('✅ Create Ticket:', createTicketResponse.data);

        // 6. Test Get All Tickets
        console.log('\n6. Testing Get All Tickets...');
        const ticketsResponse = await axios.get(`${API_URL}/api/tickets`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get All Tickets:', `Found ${ticketsResponse.data.length} tickets`);

        // 7. Test Get Single Ticket
        console.log('\n7. Testing Get Single Ticket...');
        const singleTicketResponse = await axios.get(`${API_URL}/api/tickets/${testTicketId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get Single Ticket:', singleTicketResponse.data);

        // 8. Test Add Comment
        console.log('\n8. Testing Add Comment...');
        const commentResponse = await axios.post(
            `${API_URL}/api/tickets/${testTicketId}/comments`,
            {
                text: 'This is a test comment'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        console.log('✅ Add Comment:', commentResponse.data);

        // 9. Test Update Ticket
        console.log('\n9. Testing Update Ticket...');
        const updateResponse = await axios.patch(
            `${API_URL}/api/tickets/${testTicketId}`,
            {
                status: 'In Progress',
                priority: 'High'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        console.log('✅ Update Ticket:', updateResponse.data);

        console.log('\n✨ All tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

runTests(); 