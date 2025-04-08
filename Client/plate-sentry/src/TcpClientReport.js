import { io } from 'socket.io-client';

export default class TcpClientReport {
    constructor() {
        // Create a TCP socket client
        const client = new net.Socket();
        client.connect(65432, '127.0.0.1', () => {
            console.log('Connected to server');
            
            // Send data to server
            client.write('Test');
          });
    }
};