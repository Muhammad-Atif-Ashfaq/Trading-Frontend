import React from 'react'

import { useState, useEffect } from 'react';

import BinanceBidAsk from '../../../websockets/BinanceBidAsk';
import axios from 'axios';
import BuySellModal from './BuySellModal';
import CustomModal from '../../../components/CustomModal';

import WebSocketComponent from '../../../components/WS';



const WatchMarketAskBidPricingButton = ({ symbol, pip,setIsLoading }) => {
  const currencyIds = '1,1984,80,81,7774,7778';

  // const { status, prices } = useWebSocket(import.meta.env.VITE_FSCI_ACCESS_KEY, 1);
  // console.log(status, "YE STAUTS HAAAAAAAAAAAAAAAa")

  const [pricing, setPricing] = useState({
    openPrice: null,
    askPrice: null,
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  

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
     
      const endPoint1= `${import.meta.env.VITE_FSCI_API}${key}/latest?symbol=${symbol?.feed_fetch_name}&access_key=${symbol?.data_feed?.feed_login}`

      
        const response = await axios.get(endPoint1);
        
        const data = response?.data;

        setPricing({
          
          openPrice: parseFloat(data?.response[0]?.o).toFixed(pip),
          askPrice: parseFloat(data?.response[0]?.c).toFixed(pip)
        })
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };
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
              openPrice: parseFloat(data?.bidPrice).toFixed(pip),
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

  useEffect(() => {
   
    fetchDataForSymbol(); // Fetch data initially
  }, [symbol]); // Dependencies for re-fetching

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const openModal=()=>{
  
        setIsModalOpen(true)
     
  }


  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <>
  

<WebSocketComponent apiKey={import.meta.env.VITE_FSCI_ACCESS_KEY} currencyIds={1} />


      <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <BuySellModal 
          setIsModalOpen={setIsModalOpen}
          pricing={pricing}
          setPricing={setPricing}
          fetchData={fetchDataForSymbol}
          trade_type="single"
        />
      </CustomModal>
    </>
  );
};

export default WatchMarketAskBidPricingButton
