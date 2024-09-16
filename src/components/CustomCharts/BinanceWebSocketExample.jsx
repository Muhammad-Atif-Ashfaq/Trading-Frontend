import { useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const BinanceWebSocketExample = (callback) => {
  const wsUrl = 'wss://fstream.binance.com/ws/bnbusdt@aggTrade';
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new W3CWebSocket(wsUrl);
    clientRef.current = client;

    let openPrice = null;
    let highPrice = null;
    let lowPrice = null;
    let closePrice = null;
    let volume = 0;

    const handleTradeMessage = (message) => {
      try {
        const trade = JSON.parse(message.data);
        if (trade.e !== 'aggTrade') return;

        const price = parseFloat(trade.p);
        const quantity = parseFloat(trade.q);
        const timestamp = new Date(trade.T);

        if (openPrice === null) {
          openPrice = price;
        }

        if (highPrice === null || price > highPrice) {
          highPrice = price;
        }

        if (lowPrice === null || price < lowPrice) {
          lowPrice = price;
        }

        closePrice = price;
        volume += price * quantity;

        const tradeData = {
          date: timestamp,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          volume: volume
        };

        // Invoke the callback function with the fetched trade data
        callback([{...tradeData}]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    const handleError = (error) => {
      console.error('Failed to establish WebSocket connection:', error);
    };

    const handleClose = () => {
      console.error('WebSocket connection closed unexpectedly');
    };

    client.onopen = () => {
      console.log('WebSocket connected');
    };
    client.onmessage = handleTradeMessage;
    client.onerror = handleError;
    client.onclose = handleClose;

    // Cleanup function
    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [callback]);

  return null; // No JSX to return
};

export default BinanceWebSocketExample;
