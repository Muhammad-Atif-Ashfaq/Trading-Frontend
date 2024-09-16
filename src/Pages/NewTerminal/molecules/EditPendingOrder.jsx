import { Spin, theme } from 'antd';
import React, { useState, useEffect } from 'react'
import CustomButton from '../../../components/CustomButton';
import {  numberInputStyle, submitStyle } from './style'
import { useSelector } from 'react-redux';
import CustomNotification from '../../../components/CustomNotification';
import CustomStopLossTextField from '../../../components/CustomStopLossTextField';
import { GenericEdit } from '../../../utils/_APICalls';
import { Autocomplete,TextField } from '@mui/material';
import { PendingOrderTypes } from '../../../utils/constants';
import CustomTextField from '../../../components/CustomTextField';
import CustomNumberTextField from '../../../components/CustomNumberTextField';
import { AllSymbelSettingList } from '../../../utils/_SymbolSettingAPICalls';

const EditPendingOrders = ({ setIsModalOpen,pendingOrder,fetchPendingOrders}) => {
  
  const token = useSelector(({ terminal }) => terminal?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary }} = theme.useToken();
  const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
  const [pricing, setPricing] = useState({ openPrice: '', askPrice: '' });

  const [errors,setErrors] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)


  const [isLoading, setIsLoading] = useState(false)

    const [type,setType] = useState(null);
    const [open_price,setOpen_price] = useState("");
    const [volume,setVolume] = useState(0.01);
    const [takeProfit,setTakeProfit] = useState('');
    const [stopLoss,setStopLoss] = useState('');
    const [symbolsList, setSymbolsList] = useState([])
    const [symbol, setSymbol] = useState(null);
    const [reason,setReason] = useState('')
  
  
  //region profitChange
  const handleProfitChange = (newValue) => {
    setTakeProfit(newValue);
  };
  const handleLossChange = (newValue) => {
    setStopLoss(newValue);
  };
 

  
  const clearFields = () => {
    setType(null);
    setOpen_price('');
    setVolume(0);
    setTakeProfit('');
    setStopLoss('');
    setSymbol(null);
    setReason('')

  }
  
  const handleSubmit = async() => {
  
        
       const PendingData = {
        ...pendingOrder,
        symbol: symbol?.feed_fetch_name ? symbol.feed_fetch_name : '',
        feed_name: symbol?.feed_name ? symbol?.feed_name : '',
        type:  type?.value ? type?.value : '',
        volume: String(volume) ? String(volume) : '',
        reason,
        takeProfit: String(takeProfit === "" ? "" : takeProfit),
        stopLoss: String(stopLoss === "" ? "" : stopLoss),
      } 

       setIsLoading(true)
        const Params = {
          table_name: 'trade_orders',
          table_ids: [pendingOrder?.id],
          ...PendingData
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
              description: 'Pending Order Updated Successfully',
              key: 2
            })
            clearFields()
            setIsModalOpen(false)
            fetchPendingOrders()
            setIsLoading(false)
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
 
  const setStateData = async()=>{
    setIsLoading(true)
    const { data: {  payload:SymbolsList } } = await AllSymbelSettingList(token);
    setSymbolsList(SymbolsList)

    const selectedSymbolList =  SymbolsList?.find((x)=> x.feed_fetch_name === pendingOrder?.symbol)
    setSymbol(selectedSymbolList);
    const selectedType = PendingOrderTypes.find((x)=>x.value === pendingOrder?.type)
    setType(selectedType);
    setOpen_price(pendingOrder?.open_price);
    setVolume(pendingOrder?.volume);
    setStopLoss(pendingOrder?.stopLoss)
    setTakeProfit(pendingOrder?.takeProfit)
    setReason(pendingOrder?.reason)
    setIsLoading(false)
    }


 

  useEffect(()=>{

    setStateData()

},[pendingOrder])

    
  return (
    <Spin spinning={isLoading} size="large">
       
      <div className='p-8 border border-gray-300 rounded-lg flex flex-col gap-6' style={{ backgroundColor: colorBG }}>
        
        <div className='flex gap-3 justify-between'>
          {/* <div className='flex gap-3 w-full '>
            <h1 className='text-3xl font-bold'>Create New Order</h1>
          </div> */}
        </div>
        
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

             <div>
                  <Autocomplete
                    name={'Type'}
                    variant={'standard'}
                    label={'Type'}
                    disabled={isDisabled}
                    options={PendingOrderTypes}
                    value={type}
                    getOptionLabel={(option) => option.label ? option.label : ""}
                    onChange={(e, value) => {
                      if (value) {
                        setType(value)
                      }
                      else
                        setType(null)
                    }}
                    renderInput={(params) =>
                      <TextField {...params} name="Type" label="Select Type" variant="standard" />
                    }
                  />
             </div>
                    
              <div>
              <CustomNumberTextField
                      label="Volume"
                      value={volume}
                      initialFromState={0.01}
                      onChange={(e)=>setVolume(e.target.value)}
                      disabled={isDisabled}
                      fullWidth
                      min={0.01}
                      max={100}
                      step={0.01}
                    />
                {errors?.volume && <span style={{ color: 'red' }}>{errors?.volume}</span>}
            </div> 

             <div>

                <Autocomplete
                  name="Symbol"
                  id="Symbol"
                  variant={'standard'}
                  options={symbolsList}
                  disabled={isDisabled}
                  getOptionLabel={(option) => option?.name ? option?.name : ""}
                  value={symbol}
                  onChange={(e, value) => {
                    if (value) {
                      setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      setSymbol(value)
                   
                    }
                    else
                      setSymbol(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Symbol" label="Select Symbol" variant="standard" />
                  }
                />
                {errors?.symbol && <span style={{ color: 'red' }}>{errors?.symbol}</span>}
            </div>      

            <div>
                      <CustomTextField
                        label={'Open Price'}
                        value={open_price}
                        type="number"
                        disabled={isDisabled}
                        sx={numberInputStyle}
                        varient={'standard'}
                        onChange={(e) => setOpen_price(e.target.value)}
                      />
                      {errors?.open_price && <span style={{ color: 'red' }}>{errors?.open_price}</span>}
            </div>
            
           
               
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

                 <div className="mb-4 grid grid-cols-1 gap-4">
                    <CustomTextField label={'Reasons'}
                    value={reason}
                    varient={'standard'}
                    onChange={(e) => setReason( e.target.value)}
                    multiline={true}
                    rows={1} />
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

export default EditPendingOrders