
import fetch from 'node-fetch';

async function testAPI() {
  const endpoints = [
    '/api/test',
    '/api/topics',
    '/api/market-data',
    '/api/market-data/sp500',
    '/api/market-data/cpi'
  ];

  console.log('Starting API tests...\n');

  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await fetch(`http://0.0.0.0:5000${endpoint}`);
      const data = await response.json();
      const duration = Date.now() - start;

      console.log(`📍 ${endpoint}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Time: ${duration}ms`);
      console.log('Response:', JSON.stringify(data, null, 2).slice(0, 100) + '...\n');
    } catch (error) {
      console.error(`❌ Error testing ${endpoint}:`, error.message, '\n');
    }
  }
}

testAPI();
