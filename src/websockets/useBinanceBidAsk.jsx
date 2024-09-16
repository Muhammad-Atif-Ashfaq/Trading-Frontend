import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const useBinanceBidAsk = ({ symbol, onUpdate }) => {
  const [bidPrice, setBidPrice] = useState(null);
  const [askPrice, setAskPrice] = useState(null);

  useEffect(() => {
    if (symbol) {
      const WS_URL = `wss://fstream.binance.com/stream?streams=${symbol.toLowerCase()}@bookTicker`;

      const { lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
        shouldReconnect: () => true,
      });

      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        const { b, a } = message.data;
        setBidPrice(parseFloat(b));
        setAskPrice(parseFloat(a));
        onUpdate(parseFloat(b));
      };

      if (lastJsonMessage && lastJsonMessage.data) {
        handleMessage(lastJsonMessage);
      }

     
    }
  }, [symbol, onUpdate]);

  return { bidPrice, askPrice };
};

export default useBinanceBidAsk;
