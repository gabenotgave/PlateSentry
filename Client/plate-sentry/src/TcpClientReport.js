class TcpClientReport {
    constructor() {
        this.socket = null;
        this.connectionState = 'disconnected';
        this.onMessage = null;
    }
  
    connect(role) {
        return new Promise((resolve, reject) => {
            this.connectionState = 'connecting'; // Change connection state
            // Add cookie
            document.cookie = 'Role=' + role;
            this.socket = new WebSocket('ws://localhost:65432');
  
            this.socket.onopen = () => {
                this.connectionState = 'connected';
                console.log('WebSocket connected');
                resolve();
            };

            // Handle errors
            this.socket.onerror = (error) => {
                this.connectionState = 'error';
                console.error('WebSocket error:', {
                    type: error.type,
                    readyState: this.socket?.readyState,
                    url: this.socket?.url
                });
                reject(error);
            };

            // Handle connection closure
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
                const data = event.data;

                if (data === "CONNECTION_ACCEPTED") {
                    console.log("Server accepted connection");
                }

                if (this.onMessage) {
                    try {
                        const parsed = JSON.parse(data);
                        this.onMessage(parsed);
                    } catch (e) {
                        console.warn("Failed to parse WebSocket message:", e, data);
                        this.onMessage(data);
                    }
                }
            };
        });
    }

    // Send message to server
    sendMessage(msg) {
        if (this.socket && this.connectionState === 'connected') {
            this.socket.send(msg);
            console.log('Image sent over WebSocket');
        } else {
            console.warn('WebSocket is not connected. Cannot send image.');
        }
    }

    // Send message once connection made with server
    async sendMessageWhenReady(msg) {
        if (this.connectionState !== 'connected') {
            await this.connect();
        }
        this.sendMessage(msg);
    }

    // Listen for messages from server (callback function)
    setOnMessageCallback(callback) {
        this.onMessage = callback;
    }
}
  
export default TcpClientReport;