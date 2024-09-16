import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const WebSocketComponent = ({ apiKey, currencyIds }) => {
  const [status, setStatus] = useState('Disconnected');
  const socket = useRef(null);
  const heartInterval = useRef(null);
  const reconnectTimeout = useRef(null);
  const mainUrl = 'wss://fcsapi.com';
  const backupUrl = 'wss://fxcoinapi.com';

  // Function to handle WebSocket connection
  const connectToSocket = (url) => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current.destroy();
    }

    setStatus('Connecting...');
    socket.current = io.connect(url, {
      transports: ['websocket'],
      path: '/v3/',
    });

    socket.current.emit('heartbeat', apiKey);
    socket.current.emit('real_time_join', currencyIds);

    socket.current.on('data_received', handleDataReceived);
    socket.current.on('successfully', handleSuccess);
    socket.current.on('disconnect', handleDisconnect);
    socket.current.on('connect_error', handleConnectError);

    // Set heartbeat interval
    if (heartInterval.current) clearInterval(heartInterval.current);
    heartInterval.current = setInterval(() => {
      socket.current.emit('heartbeat', apiKey);
    }, 1 * 60 * 60 * 1000); // 1 hour
  };

  // Handle incoming data
  const handleDataReceived = (pricesData) => {
    // Your logic to handle and display the data
    console.log('Data received:', pricesData);
  };

  // Handle successful connection
  const handleSuccess = (message) => {
    setStatus(`Connected: ${message}`);
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
  };

  // Handle disconnection
  const handleDisconnect = (message) => {
    setStatus(`Disconnected: ${message}`);
    attemptReconnect();
  };

  // Handle connection errors and switch to backup server
  const handleConnectError = () => {
    setStatus('Error connecting to main server, switching to backup...');
    connectToSocket(backupUrl);
  };

  // Attempt to reconnect if disconnected
  const attemptReconnect = () => {
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    reconnectTimeout.current = setTimeout(() => {
      connectToSocket(mainUrl);
    }, 15 * 60 * 1000); // 15 minutes
  };

  // Cleanup on component unmount
  const disconnectSocket = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current.destroy();
    }
    if (heartInterval.current) clearInterval(heartInterval.current);
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
  };

  useEffect(() => {
    connectToSocket(mainUrl);
    return () => disconnectSocket(); // Cleanup on unmount
  }, [currencyIds]);

  return (
    <div>
      <p id="status">{status}</p>
      {/* You can render other UI elements here, such as data received from the WebSocket */}
    </div>
  );
};

export default WebSocketComponent;
