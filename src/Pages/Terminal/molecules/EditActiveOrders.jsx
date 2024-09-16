import { Spin, theme } from 'antd';
import React, { useState, useEffect } from 'react'
import CustomButton from '../../../components/CustomButton';
import {  submitStyle } from './style'
import { useSelector } from 'react-redux';
import CustomNotification from '../../../components/CustomNotification';
import CustomStopLossTextField from '../../../components/CustomStopLossTextField';
import { GenericEdit } from '../../../utils/_APICalls';

const EditActiveOrders = ({ setIsModalOpen,activeOrder,fetchActiveOrders}) => {
  
  const token = useSelector(({ terminal }) => terminal?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary }} = theme.useToken();
  const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
  const [pricing, setPricing] = useState({ openPrice: '', askPrice: '' });

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
 


 

  useEffect(()=>{
   setStopLoss(activeOrder?.stopLoss)
   setTakeProfit(activeOrder?.takeProfit)


},[activeOrder])

    
  return (
    <Spin spinning={isLoading} size="large">
       
      <div className='p-8 border border-gray-300 rounded-lg flex flex-col gap-6' style={{ backgroundColor: colorBG }}>
        
        <div className='flex gap-3 justify-between'>
          {/* <div className='flex gap-3 w-full '>
            <h1 className='text-3xl font-bold'>Create New Order</h1>
          </div> */}
        </div>
        
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               
               <div className='w-full'>
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
                </div>
               
               
                <div className="w-full">
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
                </div>

                
         
        
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