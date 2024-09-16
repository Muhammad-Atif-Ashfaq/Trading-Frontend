import { Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useSelector } from 'react-redux';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import { SaveSymbolGroups } from '../../utils/_SymbolGroupAPI';
import { numberInputStyle } from './style';
import CustomCheckbox from '../../components/CustomCheckbox';
import { PendingOrderTypes,MarketOrderTypes, SymbolAutocompleteDummyData,TradeOrderTypes } from '../../utils/constants';
import { Get_Single_Trade_Order, Put_Trade_Order } from '../../utils/_TradingAPICalls';
import { TradeValidationSchema } from '../../utils/validations';
import { Autocomplete,TextField } from '@mui/material';
import { All_Setting_Data } from '../../utils/_SymbolSettingAPICalls';
import CustomNotification from '../../components/CustomNotification';
import moment from 'moment'






const EditLiveOrder = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary,colorTransparentPrimary  },
  } = theme.useToken();


  const token = useSelector(({user})=> user?.user?.token )
  const {orderId} = useParams()
  const navigate = useNavigate()



  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false)

// 
  const [symbolsList,setSymbolsList] = useState([])
  const [symbol,setSymbol] = useState(null);
  const [order_type, setOrder_type] = useState(null);
  const [type,setType] = useState(null);
  const [volume,setVolume] = useState('');
  const [takeProfit,setTakeProfit] = useState('');
  const [stopLoss,setStopLoss] = useState('');
  const [profit,setProfit] = useState('');
  const [comment,setComment] = useState('')
  const [open_price,setOpen_price] = useState('')
  //


 const fetchSingleTradeOrder= async(symboList)=>{
    if(orderId !== 0){
      setIsLoading(true)
      const res = await Get_Single_Trade_Order(orderId, token)
      const {data: {message, payload, success}} = res

      setIsLoading(false)
      if(success){
        
        const selectedSymbol =  symboList?.find(x=> x?.feed_fetch_name === payload.symbol)
        const selectedOrderType  = payload.order_type === 'pending' ?  PendingOrderTypes:MarketOrderTypes;
        const orderType = TradeOrderTypes.find(x=>x.value === payload.order_type)
        const selectedType = selectedOrderType.find(x=> x.value === payload.type)
        setSymbol(selectedSymbol)
        setType(selectedType)
        setOrder_type(orderType)
        setVolume(payload.volume)
        setProfit(payload.profit)
        setStopLoss(payload.stopLoss)
        setTakeProfit(payload.takeProfit)
        setComment(payload.comment);
        setOpen_price(payload.open_price)
      
      }

    }
   
  } 


const fetchSymbolSettings = async () => {
    try {
      setIsLoading(true)
      const res = await All_Setting_Data(token);
      const { data: { message, success, payload } } = res
      setSymbolsList(payload.data)
      if(orderId !== 0){
        await fetchSingleTradeOrder(payload.data)
        }
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };

 


  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'volume':
        setVolume(value);
        break;
     
      case 'takeProfit':
        setTakeProfit(value);
        break;
      case 'stopLoss':
        setStopLoss(value);
        break;
      case 'profit':
        setProfit(value);
        break;
    
        case 'open_price':
        setOpen_price(value);
        break;
      default:
        break;
    }
  };
  const clearFields = () =>{
    setSymbol(null)
    setOrder_type(null)
    setType(null)
    setVolume('')
    setTakeProfit('')
    setStopLoss('')
    setProfit('')
    setComment('');
    setOpen_price('')

    

  }
  const handleSubmit = async()=> {
     setIsLoading(true)
    try{
     
      await TradeValidationSchema.validate({
        order_type,
        symbol,
        volume,
        takeProfit,
        stopLoss,
        open_price
      }, { abortEarly: false });

      setErrors({});
   
      

         const closeOrderData ={
        symbol: symbol.feed_fetch_name,
        type: type.value,
        volume,
        takeProfit,
        stopLoss,
        profit,
        open_price,
      }

      const res = await Put_Trade_Order(orderId,closeOrderData, token)

       const {data: {message, payload, success}} = res
      
      
       if(success){
        //  clearFields()
         CustomNotification({ type:"success", title:"Transaction Order", description:message, key:1 })
          setIsLoading(false)
       
    }
    else{
       CustomNotification({ type:"error", title:"Transaction Order", description:message, key:1 })
    }
      
    
    }catch(err){
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      
    }
    CustomNotification({ type:"error", title:"Transaction Order", description:err.message, key:1 })
     setIsLoading(false)
  }



 


  useEffect(()=>{
    fetchSymbolSettings()     
  },[])

  
  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{ backgroundColor: colorBG }}>
     <div className='flex gap-3'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />
      <h1 className='text-2xl font-semibold'>Trading Account</h1>
    </div>
    <div className='border rounded-lg p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <div>
             <Autocomplete
              name="Symbol"
              id="Symbol"
              variant={'standard'}
              options={symbolsList}
              getOptionLabel={(option) => option?.name ? option?.name : ""} 
              value={symbol}
              onChange={(e,value) =>{
              if(value)
                {
                   setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                   setSymbol(value)
                }
                else
                  setSymbol(null)                                                        
                }}
                 renderInput={(params) => 
                <TextField {...params} name="Symbol" label="Symbol"  variant="standard" />
                  }
                />
         {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
         </div>
       
         <div>
       
         <Autocomplete
                name={'Type'}
                variant={'standard'}
                label={'Type'}
                options={order_type === 'pending' ? PendingOrderTypes :MarketOrderTypes}
                value={type}
                getOptionLabel={(option) => option.label ? option.label : ""}
                onChange={(e,value) =>{
                if(value)
                  {
                  
                      setType(value)
                  }
                  else
                    setType(null)                                                        
                  }}
                  renderInput={(params) => 
                  <TextField {...params} name="Type" label="Type"  variant="standard" />
                    }
                />
         {errors.type && <span style={{ color: 'red' }}>{errors.type}</span>}
         </div>
         <div>
         <CustomTextField
          name='Volume'
          type={'number'}
          varient='standard'
          label='Volume'
          value={volume}
          onChange={e => handleInputChange('volume', e.target.value)}
        />
          {errors.volume && <span style={{ color: 'red' }}>{errors.volume}</span>}
         </div>
       
          <div className="mb-4 grid grid-cols-1 gap-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CustomTextField label={'Open Price'}  type="number" value={open_price} sx={numberInputStyle}
                      varient={'standard'}  onChange={e => handleInputChange('open_price', e.target.value)}/>
                       {errors.open_price && <span style={{ color: 'red' }}>{errors.open_price}</span>}
                </div>
                <div className="flex flex-1 flex-row  gap-2 border-b">
                  <CustomButton style={{
                    backgroundColor: colorTransparentPrimary,
                    borderColor: colorTransparentPrimary,
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: 8
                  }} Text={'Update'}
                
                  />
                  <CustomCheckbox />
                  <label className='mt-2'>Auto</label>
                </div>
                
              </div>
          </div>

       <div>
       <CustomTextField
          name='Stop Loss'
          type={'number'}
          varient='standard'
          label='Stop Loss'
          value={stopLoss}
          onChange={e => handleInputChange('stopLoss', e.target.value)}
        />
        {errors.stopLoss && <span style={{ color: 'red' }}>{errors.stopLoss}</span>}
       </div>
        <div>
        <CustomTextField
          name='Take Profit'
          type={'number'}
          varient='standard'
          label='Take Profit'
          value={takeProfit}
          onChange={e => handleInputChange('takeProfit', e.target.value)}
        />
        {errors.takeProfit && <span style={{ color: 'red' }}>{errors.takeProfit}</span>}
        </div>
      
        <div>
        <CustomTextField
          name='Profit'
          varient='standard'
          label='Profit'
          type={'number'}
          value={profit}
          onChange={e => handleInputChange('profit', e.target.value)}
        />
         {errors.profit && <span style={{ color: 'red' }}>{errors.profit}</span>}
        </div>

      </div>
      <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
          <CustomButton
            Text='Cancel'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
              backgroundColor: '#c5c5c5',
              borderColor: '#c5c5c5',
              color: '#fff'
            }}
            onClickHandler={()=> navigate(-1)}
          />
          <CustomButton
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
            onClickHandler={handleSubmit}
          />

        </div>
    </div>
    </div>
    </Spin>
  )
}

export default EditLiveOrder