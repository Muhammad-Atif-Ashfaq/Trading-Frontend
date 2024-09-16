import { Spin, theme } from 'antd';
import React, { useState, useEffect } from 'react'
import CustomButton from '../../../components/CustomButton';
import {  submitStyle } from './style'
import { useSelector } from 'react-redux';
import CustomNotification from '../../../components/CustomNotification';
import CustomStopLossTextField from '../../../components/CustomStopLossTextField';
import { GenericEdit } from '../../../utils/_APICalls';
import axios from 'axios';
import BinanceBidAsk from '../../../websockets/BinanceBidAsk';
import { Typography } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const EditActiveOrders = ({ setIsModalOpen,activeOrder,fetchActiveOrders,symbol,pip}) => {
  
  const token = useSelector(({ terminal }) => terminal?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary }} = theme.useToken();
  const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
  const [pricing, setPricing] = useState({ openPrice: null, askPrice: null });
 
  const [showStopLoss,setShowStopLoss] = useState(false)
  const [showTakeProfit,setShowTakeProfit] = useState(false)


  const [errors,setErrors] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)


  const [isLoading, setIsLoading] = useState(false)
 
  const [takeProfit,setTakeProfit] = useState('');
  const [stopLoss,setStopLoss] = useState('');
  
  
  //region profitChange
  const handleProfitChange = (newValue) => {
    setTakeProfit(newValue);
  };
  const handleLossChange = (newValue) => {
    setStopLoss(newValue);
  };
 

  
  const clearFields = () => {
   
    setTakeProfit('');
    setStopLoss('');
  }
  
  const handleSubmit = async() => {
    const orderData = {
       ...activeOrder,
       takeProfit,
       stopLoss
      }

       setIsLoading(true)
        const Params = {
          table_name: 'trade_orders',
          table_ids: [activeOrder?.id],
          ...orderData
        }
       

    try {
        
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
         if (res !== undefined) {
          if (success) {
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Active Order Updated Successfully',
              key: 2
            })
            clearFields()
            setIsModalOpen(false)
            fetchActiveOrders()
          } else {
            setIsLoading(false)
            CustomNotification({
              type: 'error',
              title: 'error',
              description: message,
              key: `abc`
            })
          }
        }
       
        }
    catch(err) {
                const validationErrors = {};
                err.inner?.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
        }

  }
 


  


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
              
                bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
                askPrice: parseFloat(data?.askPrice).toFixed(pip)
            });
            
            }
          }catch(error){
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

 

  useEffect(()=>{
   setStopLoss(activeOrder?.stopLoss)
   setTakeProfit(activeOrder?.takeProfit)

},[activeOrder])

    
  return (
    <Spin spinning={isLoading} size="large">
       
      <div className='p-8 border border-gray-300 rounded-lg flex flex-col gap-6' style={{ backgroundColor: colorBG }}>
        
        <div className='flex gap-3 justify-between'>
          <div className='flex justify-between w-full'>
            {/* <h1 className='text-3xl font-bold'>Create New Order</h1> */}
            <Typography sx={{color:"#1CAC70",fontWeight:600}}> Ask Price: {pricing?.askPrice}</Typography>
            <Typography sx={{color:"#D52B1E",fontWeight:600}}> Bid Price: {pricing?.openPrice}</Typography>
          </div> 
        </div>
        

          <div className='flex justify-between w-full'>
                <FormControlLabel control={<Checkbox defaultChecked /> } checked={showStopLoss} onChange={(e)=>setShowStopLoss(e.target.checked)}  label="Stop Loss" />
                <FormControlLabel control={<Checkbox defaultChecked />} checked={showTakeProfit} onChange={(e)=>setShowTakeProfit(e.target.checked)} label="Take Profit" />
          </div>
          
          <div className='flex justify-between w-full'>

             {showStopLoss && <div className='w-full'>
                  <CustomStopLossTextField
                      label="Stop Loss"
                      value={stopLoss}
                      initialFromState={pricing?.askPrice ? pricing?.askPrice : 0}
                      checkFirst={stopLoss === '' ? true : false}
                      onChange={handleLossChange}
                      fullWidth
                      min={0}
                      step={0.1}
                      />
                  {errors?.stopLoss && <span style={{ color: 'red' }}>{errors?.stopLoss}</span>}
              </div>}

            {showTakeProfit && <div className="w-full">
                  <CustomStopLossTextField
                    label="Take Profit"
                    value={takeProfit}
                    initialFromState={pricing?.askPrice ? pricing?.askPrice : 0}
                    checkFirst={takeProfit === '' ? true : false}
                    onChange={ handleProfitChange}
                    fullWidth
                    min={0}
                    step={0.1}
                  />
                {errors?.takeProfit && <span style={{ color: 'red' }}>{errors?.takeProfit}</span>}
              </div>}

          </div>
          
              
        </div>
        <div className='w-full flex  justify-end  gap-5'>
                <CustomButton
                    Text={'Update'}
                    style={submitStyle}
                    onClickHandler={handleSubmit}
                    disabled={isDisabled}
                    />
                    <CustomButton
                    Text={'Cancel'}
                    style={{ backgroundColor: '#C5C5C5', borderColor: '#C5C5C5', color: '#fff', ...submitStyle }}
                    disabled={isDisabled}
                    onClickHandler={()=>setIsModalOpen(false)}
                />
        </div>
    </Spin>
  )
}

export default EditActiveOrders