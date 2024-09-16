let socket;
const BinanceSocket = (symbol, onDataReceived, onError) => {
  let currentSymbol;

  if (typeof WebSocket === 'undefined') {
    console.error('WebSocket is not supported in this environment.');
    return null;
  }

  // Check if the symbol has changed or if there's no existing connection
  if (symbol !== currentSymbol) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log(`Closing previous WebSocket connection`);
      socket.close();
    }

    socket = new WebSocket(`wss://fstream.binance.com/stream?streams=${symbol.toLowerCase()}@bookTicker`);
    currentSymbol = symbol;
    console.log('Creating new WebSocket connection for symbol:', symbol);

    socket.onopen = () => {
      console.log(`Connected to new Binance stream for symbol: ${currentSymbol}`);
    };

    socket.onmessage = (event) => {
      onDataReceived(event.data);
    };

    socket.onclose = () => {
      console.log(`Disconnected from previous Binance stream for symbol: ${currentSymbol}`);
    };

    socket.onerror = (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error(`WebSocket error for symbol ${currentSymbol}:`, error);
      }
    };
  }

  const closeConnection = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };

  return {
    closeConnection
  };
};

export default BinanceSocket;
