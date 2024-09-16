import { w3cwebsocket as W3CWebSocket } from 'websocket';

let client;
let currentSymbol;

const BinanceBidAsk = (symbol, connected) => {
  const binance_socket_url = import.meta.env.VITE_BINANCE_SOCKET_URL
  const fsci_socket_url = import.meta.env.VITE_FSCI_SOCKET_URL

  if (symbol == null) {
    // Stop the WebSocket connection if it's active
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Stopping WebSocket connection`);
    }
    return null;
  }

  let WS_URL;

  if (symbol?.feed_name === 'binance') {
    WS_URL = `${binance_socket_url}?streams=${symbol?.feed_fetch_name?.toLowerCase()}@bookTicker`;
  } else {
    
    WS_URL = `${fsci_socket_url}${symbol?.feed_fetch_name?.replace(/\//g, '')}`;
  }

  if (typeof WebSocket === 'undefined') {
    console.error('WebSocket is not supported in this environment.');
    return null;
  }

  // Check if the checkbox is not checked
  if (!connected) {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Closing previous WebSocket connection for symbol: ${currentSymbol}`);
    }
    return null;
  }

  // Check if the symbol has changed or if there's no existing connection
  if (symbol?.feed_name === 'binance' ? symbol?.feed_fetch_name : symbol?.feed_fetch_key !== currentSymbol) {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Closing previous WebSocket connection for symbol: ${currentSymbol}`);
    }
  }

  client = new W3CWebSocket(WS_URL);
  currentSymbol =  symbol?.feed_fetch_name ;
  console.log('Creating new WebSocket connection for symbol:', currentSymbol);

  const onDataReceived = (callback) => {
    if (symbol?.feed_name === 'binance') {
      
      if (!client.onmessage) {
        callback({ bidPrice: null, askPrice: null });
      }
      client.onmessage = (message) => {
        
        try {
          const parsedMessage = JSON.parse(message.data);
              // console.log('Received message in binance:', parsedMessage);
          const { b, a } = parsedMessage.data;
          callback({ bidPrice: b, askPrice: a });
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    } else if (symbol?.feed_name === 'fcsapi') {
    
      if (!client.onmessage) {
        callback({ bidPrice: null, askPrice: null });
      }
      client.onmessage = (message) => {
        
        try {
         
          const parsedMessage = JSON.parse(message.data);
           console.log('Received message in fscpi:', parsedMessage);
          // if (parsedMessage.type === 'data_received') {
            const { Ask, Bid } = parsedMessage;
            callback({ bidPrice: Bid, askPrice: Ask });
          // }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    }
  };

  const onError = (callback) => {
    client.onerror = (error) => {
      console.error(`WebSocket error for symbol ${currentSymbol}:`, error);
      callback(error);
    };
  };

  const onClose = (callback) => {
    client.onclose = () => {
      console.log(`Disconnected from previous ${symbol?.feed_name} stream`);
      callback();
    };
  };

  const onStop = (callback) => {
    client.onclose = () => {
      console.log(`Stopped from previous ${symbol?.feed_name} stream`);
      callback();
    };
  };

  const connect = () => {
    client.onopen = () => {
      if (symbol?.feed_name === 'binance') {
        console.log(`Connected to new Binance stream for symbol: ${currentSymbol}`);
      } else if (symbol?.feed_name === 'fcsapi') {
        console.log(`WebSocket connection established for ${symbol?.feed_name}.`);
        // Verify Your API key on the server
        client.send(JSON.stringify({ type: 'heartbeat', api_key: symbol?.data_feed?.feed_login }));

        // Connect Ids on server
        client.send(JSON.stringify({ type: 'real_time_join', currencyPair: symbol?.feed_fetch_name }));
      }
    };
  };

  const start = (dataCallback, errorCallback, closeCallback) => {
    connect();
    onDataReceived(dataCallback);
    onError(errorCallback);
    onClose(closeCallback);
  };

  const stop = (stopCallback) => {
    onStop(stopCallback);
  };

  return { start, stop };
};

export default BinanceBidAsk;
