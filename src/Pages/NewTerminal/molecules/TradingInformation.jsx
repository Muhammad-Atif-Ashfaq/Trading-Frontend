import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Tab, Tabs,Grid } from '@mui/material';
import CustomButton from '../../../components/CustomButton';
import Information from './Information';
import TablesTabs from './TablesTabs';
import TradeChart from './TradeChart';
import TradingHours from './TradingHours'
import { useSelector } from 'react-redux';
import BinanceBidAsk from '../../../websockets/BinanceBidAsk';
import { ALL_Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';
import axios from 'axios';
import BuySellModal from './BuySellModal';
import CustomModal from '../../../components/CustomModal';
import CustomNotification from '../../../components/CustomNotification';
import ChartComponent from '../../../components/CustomCharts';


const TradingInformation = () => {
 
 const [activeTab, setActiveTab] = useState('1');
 const [connected, setConnected] = useState(true);
 const [pricing, setPricing] = useState({ openPrice: '', askPrice: '' });
 const selectedWatchMarket= useSelector(({terminal})=>terminal?.selectedWatchMarket)
 const [open_price,setOpen_price] = useState('');
 const [isModalOpen, setIsModalOpen] = useState(false);

 const totalProfit = useSelector(({terminal})=>terminal?.active_profit);
 const free_margin = useSelector(({terminal})=>terminal?.active_free_margin)
 const equity =  useSelector(({terminal})=>terminal?.active_equity);
 const token = useSelector(({ terminal }) => terminal?.user?.token)



  const trading_account = useSelector(({terminal})=>terminal?.user?.trading_account)
  const selectedTerminalSymbolIndex = useSelector(({terminal})=>terminal?.selectedTerminalSymbolIndex)
  const selectedTerminalSymbolSettingIndex = useSelector(({terminal})=>terminal?.selectedTerminalSymbolSettingIndex)
  const user = useSelector(({ terminal }) => terminal?.user?.trading_account)

   const fetchBinanceData = async (symbol, pip) => {
    try {
      const endPoint= `${import.meta.env.VITE_BINANCE_API}?symbol=${symbol}`
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
      const endPoint1= `${import.meta.env.VITE_FSCI_API}${key}/latest?id=${symbol?.toLowerCase()}&access_key=lg8vMu3Zi5mq8YOMQiXYgV`

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

  const fetchData = (symbol, connected, pip) => {
      const onError = (error) => {
        console.error('WebSocket error:', error);
      };
  
      const onClose = () => {
        console.log('Previous WebSocket connection closed');
      };

      const binanceStream = BinanceBidAsk(symbol, connected);
  
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
             console.log('live Data here')
              setPricing({
                
                 openPrice: parseFloat(data?.bidPrice).toFixed(pip),
                  askPrice: parseFloat(data?.askPrice).toFixed(pip)
                });        
            }
          }catch(error)
          { console.error("Error in onDataReceived:", error) }
          
        };
  
        binanceStream.start(onDataReceived, onError, onClose);
        // Optionally, stop the WebSocket connection when it's no longer needed  
        // binanceStream.stop();
      };
    
  }

  useEffect(()=>{
  
    fetchData(selectedWatchMarket, connected, selectedWatchMarket?.pip)
  
  },[selectedWatchMarket])


   const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const items = [
    {
      key: '1',
      label: 'Trading Chart',
      component: <TradeChart />
    },
    {
      key: '2',
      label: 'Information',
      component: <Information />,
    },
  ];

  const onChange = (event, key) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      setActiveTab(key);
    }
  };

  const openModal=()=>{
    if(selectedTerminalSymbolIndex>=0  && selectedTerminalSymbolSettingIndex>=0)
      {
        setIsModalOpen(true)
      }
      else{
         CustomNotification({
        type: 'error',
        title: 'Error',
        description: 'Please Select Symbol Settings....',
        key: 1
      });
      }
  }

  const descriptions = [
    { label: 'Balance:', value: trading_account?.balance },
    { label: 'Credit:', value: trading_account?.credit },
    { label: 'Profit:', value: totalProfit },
    { label: 'Equity:', value: equity },
    { label: 'Free Margin:', value: free_margin },
    { label: 'Leverage:', value: trading_account?.leverage }
  ];

  return (
    <>
    <Grid container sx={{height:"100%",}} gap={6}> 
        
        <Grid xs={12} sx={{height:"50%"}}>
            {/* <TradeChart/> */}
            <ChartComponent />

        </Grid>      

        <Grid item xs={12} sx={{height:"45%"}}>
           <TablesTabs/>
        </Grid>

    </Grid>
     
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
          fetchData={fetchData}
          trade_type="single"
        />
     </CustomModal>
    
    </>
);
};

export default TradingInformation;
