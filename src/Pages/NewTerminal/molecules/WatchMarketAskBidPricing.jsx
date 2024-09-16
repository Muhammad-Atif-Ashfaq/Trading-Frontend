import React from 'react'

import { useState, useEffect } from 'react';

import BinanceBidAsk from '../../../websockets/BinanceBidAsk';
import { Typography } from '@mui/material';
import axios from 'axios';


const WatchMarketAskBidPricing = ({ symbol, pip,setIsLoading }) => {
  const [pricing, setPricing] = useState({
    openPrice: null,
    askPrice: null,
  });
  

    const fetchBinanceData = async (feed_fetch_name, pip) => {
    try {
      const endPoint= `${import.meta.env.VITE_BINANCE_API}?symbol=${feed_fetch_name}`
        const response = await axios.get(endPoint);
        const data = response?.data;
       
        setPricing({
          openPrice: parseFloat(data?.bidPrice).toFixed(pip),
          askPrice: parseFloat(data?.askPrice).toFixed(pip)
        })
    
        return data;
      
     
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFcsapiData = async (symbol, key, pip) => {
    
    try {
     
      const endPoint1= `https://fcsapi.com/api-v3/${key}/latest?symbol=${symbol?.feed_fetch_name}&access_key=${symbol?.data_feed?.feed_login}`

      
        const response = await axios.get(endPoint1);
        const data = response?.data;

        setPricing({
          ...pricing,
          openPrice: parseFloat(data?.response[0]?.o).toFixed(pip),
          askPrice: parseFloat(data?.response[0]?.c).toFixed(pip)
        })
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDataForSymbol = async () => {

      if(symbol?.feed_name === 'fcsapi'){
      fetchFcsapiData(symbol, symbol?.feed_fetch_key, pip)
    }

    const onError = (error) => {
        console.error('WebSocket error:', error);
      };
  
      const onClose = () => {
        console.log('Previous WebSocket connection closed');
      };

      const binanceStream = BinanceBidAsk(symbol, true);

      if (binanceStream) {
        
        const onDataReceived = (data) => {
            try{
              if(!data?.bidPrice){
                if(symbol?.feed_name === 'binance'){
                  fetchBinanceData(symbol?.feed_fetch_name, pip)
                }
                else{
    
                  fetchFcsapiData(symbol?.feed_fetch_name, symbol?.feed_fetch_key, pip)
                }
              }
              else {  
              setPricing({
                ...prev,
                  bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
                  askPrice: parseFloat(data?.askPrice).toFixed(pip)
              });
    
              }
            }catch (error) {
              console.error("Error in onDataReceived:", error); 
            }
        };
  
        binanceStream.start(onDataReceived, onError, onClose);
        // Optionally, stop the WebSocket connection when it's no longer needed  
        // binanceStream.stop();
      };
    

    };

    fetchDataForSymbol(); // Fetch data initially
  }, [symbol]); // Dependencies for re-fetching

  return (
    <>
     <Typography sx={{ p: 0, color: '#D52B1E', fontSize: '10px' }}>
        {pricing.askPrice}
      </Typography>
      <Typography sx={{ p: 0, color: '#0ECB81', fontSize: '10px' }}>
        {pricing.openPrice}
      </Typography>
      
    </>
  );
};

export default WatchMarketAskBidPricing
