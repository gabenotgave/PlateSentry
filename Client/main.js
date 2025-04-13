class TcpClientReport {
  constructor() {
      this.socket = null;
      this.connectionState = 'disconnected';
  }

  connect() {
      return new Promise((resolve, reject) => {
          this.connectionState = 'connecting';
          this.socket = new WebSocket('ws://localhost:65432');

          // Add these headers if needed
          this.socket.onopen = () => {
              this.connectionState = 'connected';
              console.log('WebSocket connected');
              resolve();
          };

          this.socket.onerror = (error) => {
              this.connectionState = 'error';
              console.error('WebSocket error:', {
                  type: error.type,
                  readyState: this.socket?.readyState,
                  url: this.socket?.url
              });
              reject(error);
          };

          this.socket.onclose = (event) => {
              this.connectionState = 'disconnected';
              console.log('WebSocket closed:', {
                  code: event.code,
                  reason: event.reason,
                  wasClean: event.wasClean
              });
          };

          // Add this to track handshake
          this.socket.onmessage = (event) => {
              if (event.data === "CONNECTION_ACCEPTED") {
                  console.log("Server accepted connection");
              }
          };
      });
  }

  // ... rest of your methods ...
}

export default TcpClientReport;