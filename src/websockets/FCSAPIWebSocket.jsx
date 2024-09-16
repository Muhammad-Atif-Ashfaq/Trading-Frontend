import io from 'socket.io-client';

const establishWebSocketConnection = (api_key, currencyIds, onDataReceived, onError, onClose) => {
    console.log('Connecting to WebSocket server...');
    // Connect to the WebSocket server
    // const socket = io.connect('wss://fcsapi.com/', { transports: ['websocket'],
    // path : "/v3/" });
    const socket = io.connect('wss://fcsapi.com', { transports: ['websocket'], timeout: 5000 });
    // const socket = io.connect('wss://fcsapi.com', { timeout: 5000   }); // 5000 milliseconds (adjust as needed)
    console.log(socket)
    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        onError(error);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('WebSocket connection closed.');
        onClose();
    });

    // Handle successful connection
    socket.on('connect', () => {
        console.log('WebSocket connected.');
        // Verify API key and join currency IDs
        socket.emit('heartbeat', api_key);
        socket.emit('real_time_join', currencyIds);
    });

    // Handle received data
    socket.on('data_received', (data) => {
        // Data contains: Price, ASK price, BID price
        console.log(data);
        onDataReceived(data);
    });

    // Return function to close the WebSocket connection
    // return () => {
    //     socket.disconnect();
    // };
};

export default establishWebSocketConnection;
