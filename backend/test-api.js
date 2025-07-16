const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postData) {
            req.write(postData);
        }

        req.end();
    });
}

// Test the API endpoints
async function testAPI() {
    const baseURL = 'localhost';
    const port = 5000;

    console.log('Testing Password Manager API...\n');

    try {
        // Test 1: Health Check
        console.log('1. Testing health check endpoint...');
        const healthResponse = await makeRequest({
            hostname: baseURL,
            port: port,
            path: '/api/health',
            method: 'GET'
        });
        console.log(`Status: ${healthResponse.statusCode}`);
        console.log(`Response: ${healthResponse.body}\n`);

        // Test 2: Get all passwords (should be empty initially)
        console.log('2. Testing get all passwords...');
        const getAllResponse = await makeRequest({
            hostname: baseURL,
            port: port,
            path: '/api/passwords',
            method: 'GET'
        });
        console.log(`Status: ${getAllResponse.statusCode}`);
        console.log(`Response: ${getAllResponse.body}\n`);

        // Test 3: Create a password entry
        console.log('3. Testing create password entry...');
        const createData = JSON.stringify({
            site: 'example.com',
            username: 'test@example.com',
            password: 'testpassword123'
        });
        
        const createResponse = await makeRequest({
            hostname: baseURL,
            port: port,
            path: '/api/passwords',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(createData)
            }
        }, createData);
        
        console.log(`Status: ${createResponse.statusCode}`);
        console.log(`Response: ${createResponse.body}\n`);

        // Test 4: Test validation error
        console.log('4. Testing validation error...');
        const invalidData = JSON.stringify({
            site: 'example.com',
            username: '', // Empty username should trigger validation error
            password: 'testpassword123'
        });
        
        const validationResponse = await makeRequest({
            hostname: baseURL,
            port: port,
            path: '/api/passwords',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(invalidData)
            }
        }, invalidData);
        
        console.log(`Status: ${validationResponse.statusCode}`);
        console.log(`Response: ${validationResponse.body}\n`);

        // Test 5: Test 404 error
        console.log('5. Testing 404 error...');
        const notFoundResponse = await makeRequest({
            hostname: baseURL,
            port: port,
            path: '/api/nonexistent',
            method: 'GET'
        });
        console.log(`Status: ${notFoundResponse.statusCode}`);
        console.log(`Response: ${notFoundResponse.body}\n`);

        console.log('API tests completed!');

    } catch (error) {
        console.error('Error testing API:', error.message);
        console.log('\nMake sure the server is running: npm start');
    }
}

// Run the tests
testAPI();
