const http = require('http');

const payload = JSON.stringify({
  name: 'Teste Automático',
  description: 'Descrição de teste',
  price: '9.99',
  release_date: '2025-12-15',
  developer_id: 1,
  categories: [1, 1, 9999]
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/games',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', res.headers);
    console.log('BODY:', data);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(payload);
req.end();
