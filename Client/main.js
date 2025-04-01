const net = require('net');

// Create a TCP socket client
const client = new net.Socket();

// Connect to local server
client.connect(65432, '127.0.0.1', () => {
  console.log('Connected to server');
  
  // Send data to server
  client.write('Test');
});

// Receive data from server
client.on('data', (data) => {
  console.log('Received:', data.toString());
});

// Handle connection close
client.on('close', () => {
  console.log('Connection closed');
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error:', err);
});