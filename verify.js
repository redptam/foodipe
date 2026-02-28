const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123'
});

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/users/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log('HEADERS:', JSON.stringify(res.headers, null, 2));

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
