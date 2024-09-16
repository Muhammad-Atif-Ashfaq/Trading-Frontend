import { Spin, theme } from 'antd';
import React, { useState, useEffect } from 'react'
import { TradeOrderTypes, PendingOrderTypes, LeverageList, CurrenciesList } from '../../utils/constants';
import { Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TradeTimeChips } from '../../utils/constants'
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomCheckbox from '../../components/CustomCheckbox';
import { TradeValidationSchema } from '../../utils/validations';
import { numberInputStyle } from './style'
import { useDispatch, useSelector } from 'react-redux';
import { Get_Single_Trading_Account, Post_Group_Trade_Order, Post_Trade_Order } from '../../utils/_TradingAPICalls';
import { Autocomplete, TextField } from '@mui/material';
import { AllSymbelSettingList, All_Setting_Data } from '../../utils/_SymbolSettingAPICalls';
import CustomNotification from '../../components/CustomNotification';
import BinanceBidAsk from '../../websockets/BinanceBidAsk';
import axios from 'axios';
import TradePrice from './TradePrice';
import CustomNumberTextField from '../../components/CustomNumberTextField';
import CustomStopLossTextField from '../../components/CustomStopLossTextField';
import { addZeroBeforeOne, calculateLotSize, calculateMargin, requiredMargin, conditionalLeverage, calculateMarginCallPer, checkCurrencyPosition } from '../../utils/helpers';
import moment from 'moment';
import CandleStickChart from '../../components/CandleStickChart';
import CustomModal from '../../components/CustomModal';
import { setOrderRefresh } from '../../store/terminalSlice';

const Trade = ({ trade_type }) => {

  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const dispatch = useDispatch();
  const account_currency = useSelector(({ user }) => user?.user?.user?.currency)
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds ? state?.trade?.selectedRowsIds[0] : 0)
  const trading_group_id = useSelector((state) => state?.tradeGroups?.selectedRowsIds ? state?.tradeGroups?.selectedRowsIds[0] : 0)
  const stop_out = useSelector((state) => state?.tradingAccountGroup?.tradingAccountGroupData?.brand?.stop_out)
  const { balance, currency, leverage, brand_margin_call, id } = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error_message, setErrorMessage] = useState('');
  const [authKey, setAuthKey] = useState(null)
  const { value: accountLeverage } = LeverageList?.find(x => x?.title === leverage) || { value: '0', title: '0:0' }
  const equity = useSelector((state) => state.tradingAccountGroup.tradingAccountGroupData.equity)
  const marg = useSelector((state) => state.tradingAccountGroup.tradingAccountGroupData.margin)

  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [symbolsList, setSymbolsList] = useState([])
  const [symbol, setSymbol] = useState(null);
  const [order_type, setOrder_type] = useState(TradeOrderTypes.slice(0, 2)[1]);
  const [type, setType] = useState(null);
  const [volume, setVolume] = useState('');
  const [lotstep, setLotStep] = useState('');
  const [margin, setMargin] = useState(0);
  const [volumerange, setVolumeRange] = useState({
    min_vol: '',
    max_vol: ''
  });
  const [pipVal, setPipVal] = useState(0);
  const [open_price, setOpen_price] = useState('');
  const [comment, setComment] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [stop_limit_price, setStop_limit_price] = useState('')
  const [pricing, setPricing] = useState({ openPrice: '', askPrice: '' });
  const [connected, setConnected] = useState(true);
  const [lot_size, setLotSize] = useState(0)
  const [d_lot, setD_lot] = useState(0)
  const [commission, setCommission] = useState("")
  const [trading_account, set_trading_account] = useState(null)
  const [rcvd_type, setrcvdType] = useState("")
  const [time_state, setTimeState] = useState("1m")
  const [brand_id, setBrand_id] = useState(-1);
  const { title: CurrencyName } = CurrenciesList?.find(x => x.value === currency) || { label: 'Dollar ($)', value: '$', title: 'USD' }
  const [errors, setErrors] = useState({});
  const lotSize = calculateLotSize(volume)
  const calculatedMargin = requiredMargin(volume, accountLeverage)
  const Margin = calculateMargin(lotSize, accountLeverage)

  //region profitChange
  const handleProfitChange = (newValue) => {
    setTakeProfit(newValue);
  };
  const handleLossChange = (newValue) => {
    setStopLoss(newValue);
  };

  const handleVolumeChange = (newValue) => {

    setLotSize(symbol?.lot_size * newValue)
    setD_lot(newValue)
    const pipValue = checkCurrencyPosition(symbol, pricing, account_currency)
    setPipVal(pipValue)


    const res = parseFloat(symbol?.lot_size) * parseFloat(pricing?.openPrice) / conditionalLeverage(trading_account, symbol)
    const margin_val = res * parseFloat(newValue)

    setMargin(margin_val)
    // const margin_level =  calculateMarginCallPer(equity, margin)
    setVolume(newValue)
  }
  //#region inputChange
  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'order_type':
        setOrder_type(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'volume':
        setVolume(value);
        break;
      case 'comment':
        setComment(value);
        break;
      case 'open_price':
        setOpen_price(value);
        break;
      case 'takeProfit':
        setTakeProfit(value);
        break;
      case 'stopLoss':
        setStopLoss(value)
      default:
      case 'stop_limit_price':
        setStop_limit_price(value)
        break;
    }
  };
  // #region clearFields
  const clearFields = () => {
    setSymbol(null);
    // setOrder_type(null);
    setType(null);
    setVolume('');
    setOpen_price('');
    setComment('');
    setTakeProfit('');
    setStopLoss('');
    setPricing({
      ...pricing,
      openPrice: '',
      askPrice: ''
    })
    setVolumeRange({
      ...volumerange,
      min_vol: '',
      max_vol: ''
    })
    setLotStep('')
    setStop_limit_price('')
  }

  //region Create Order
  const createOrder = async (typeReceive, skip = false) => {
    try {
      await TradeValidationSchema.validate({
        symbol,
        order_type,
        volume,
        open_price: (connected && typeReceive === 'buy') ? pricing.openPrice : (connected && typeReceive === 'sell') ? pricing.askPrice : open_price,
        // takeProfit,
        // stopLoss,
      }, { abortEarly: false });

      setErrors({});
      const SymbolData = {
        symbol: symbol.feed_fetch_name,
        feed_name: symbol.feed_name,
        order_type: order_type.value,
        type: typeReceive ? typeReceive : type.value,
        volume: String(volume),
        comment,
        takeProfit: String(takeProfit === "" ? "" : takeProfit),
        stopLoss: String(stopLoss === "" ? "" : stopLoss),
        stop_limit_price,
        trading_account_id,
        open_price: String((connected && typeReceive === 'buy') ? `${pricing.openPrice}` : (connected && typeReceive === 'sell') ? `${pricing.askPrice}` : open_price),
        open_time: moment().format('MM/DD/YYYY hh:mm A'),
        brand_id,
        commission: commission,

      }

      const TradeGroupSymbolData = {
        symbol: symbol.feed_fetch_name,
        feed_name: symbol.feed_name,
        order_type: order_type.value,
        type: typeReceive ? typeReceive : type.value,
        volume: String(volume),
        comment,
        takeProfit: String(takeProfit === "" ? "" : takeProfit),
        stopLoss: String(stopLoss === "" ? "" : stopLoss),
        stop_limit_price,
        trading_group_id: trading_group_id,
        open_price: String((connected && typeReceive === 'buy') ? `${pricing.openPrice}` : (connected && typeReceive === 'sell') ? `${pricing.askPrice}` : open_price),
        open_time: new Date().toISOString(),
        commission: commission,
        skip: skip
        // brand_id
      }
      setIsLoading(true)
      const res = await (trade_type === "group" ? Post_Group_Trade_Order(TradeGroupSymbolData, token) : Post_Trade_Order(SymbolData, token))
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        fetchData(null, connected, 0); //to stop connection when no symbol is selected
        CustomNotification({ type: "success", title: "Live Order", description: message, key: 1 })
        dispatch(setOrderRefresh())
        // CurrentPage && fetchLiveOrder(CurrentPage)
        clearFields()
      }
      else {
        setIsLoading(false)
        CustomNotification({ type: "error", title: "Live Order", description: message, key: 1 })
        if (trade_type === "group") {
          setIsModalOpen(true)
          setErrorMessage(payload?.balance)
        }
      }

    } catch (err) {
      CustomNotification({ type: "error", title: "Live Order", description: err.message, key: 1 })

      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }
  const handleSubmit = (typeReceive, skip) => {
    //From here
    setrcvdType(typeReceive)
    // const tradePrice = (`connected` && typeReceive ==='buy') ? pricing.openPrice : (connected && typeReceive ==='sell') ? pricing.askPrice : open_price;
    if (trade_type === "single") {
      const res = (parseFloat(parseFloat(volume) * parseFloat(symbol?.lot_size) * open_price).toFixed(2));
      const margin = calculateMargin(res, conditionalLeverage(trading_account, symbol));
      if (margin > equity) {
        CustomNotification({
          type: "error",
          title: "Validation",
          description: 'Margin must be lesser than equity and greater than brand stop out',
          key: 1
        })
      }
      else {
        balance > 0 ? (stopLoss !== "" || takeProfit !== "") ? typeReceive === 'sell' ? (stopLoss > (connected ? pricing.askPrice : open_price) && takeProfit < (connected ? pricing.askPrice : open_price)) ?
          createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Sell)", description: 'Stop Loss should be greater and Take Profit should be less than Price', key: 1 }) :
          typeReceive === 'buy' ?
            (stopLoss < (connected ? pricing.askPrice : open_price) && takeProfit > (connected ? pricing.askPrice : open_price)) ?
              createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Buy)", description: 'Take Profit should be greater and Stop Loss should be less than Price', key: 1 }) :
            createOrder(typeReceive)
          :
          createOrder(typeReceive)
          :
          CustomNotification({ type: "error", title: "Live Order", description: `Insufficient Balance. You balance should be greater than $${calculatedMargin.toFixed(2)} but you have $${balance}`, key: 1 })
      }
    }
    else {
      createOrder(typeReceive, skip)
       
    }

    // if(margin > balance || balance === 0 ){
    // CustomNotification({ 
    //   type: "error", 
    //   title: "Validation", 
    //   description: 'Margin must be less than your balance', 
    //   key: 1 
    // })
    // }
    // else{
    //   balance > 0 ? (stopLoss !== "" || takeProfit !== "") ?  typeReceive === 'sell' ? (stopLoss > (connected ? pricing.askPrice : open_price ) && takeProfit < (connected ? pricing.askPrice : open_price )) ?
    //   createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Sell)", description: 'Stop Loss should be greater and Take Profit should be less than Price', key: 1 }) :
    //   typeReceive === 'buy' ? 
    //   (stopLoss < (connected ? pricing.askPrice : open_price ) && takeProfit > (connected ? pricing.askPrice : open_price )) ?
    //   createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Buy)", description: 'Take Profit should be greater and Stop Loss should be less than Price', key: 1 }) :
    //   createOrder(typeReceive)
    //   :
    //   createOrder(typeReceive)
    //   :
    //   CustomNotification({ type: "error", title: "Live Order", description: `Insufficient Balance. You balance should be greater than $${calculatedMargin.toFixed(2)} but you have $${balance}`, key: 1 })
    //
  }
  //region fetch symbol settings
  const fetchSymbolSettings = async () => {
    try {
      setIsLoading(true)
      // const res = await All_Setting_Data(token);
      const res = await AllSymbelSettingList(token);
      const { data: { message, success, payload } } = res
      // setSymbolsList(payload).data

      setSymbolsList(payload)
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };


  const fetchSingleTradeAccount = async () => {

    setIsLoading(true)
    const res = await Get_Single_Trading_Account(trading_account_id, token)
    const { data: { message, payload, success } } = res


    setIsLoading(false)
    if (success) {
      set_trading_account(payload)
      setBrand_id(payload?.brand_id)

    }



  }

  useEffect(() => {
    fetchSingleTradeAccount()
    fetchSymbolSettings()
  }, [])

  useEffect(() => {

    return () => {

      fetchData(null, connected, 0);
    };
  }, []);



  useEffect(() => {
    if (symbol?.feed_fetch_name) {
      const res = parseFloat(symbol?.lot_size) * parseFloat(pricing?.openPrice) / conditionalLeverage(trading_account, symbol)
      const margin_val = res * parseFloat(volume)
      setMargin(margin_val)
    }
  }, [pricing.openPrice])

  const fetchBinancehData = async (symbol, pip) => {
    try {
      const endPoint = `${import.meta.env.VITE_BINANCE_API}?symbol=${symbol}`

      const response = await axios.get(endPoint);
      const data = response?.data;

      setPricing({
        openPrice: parseFloat(data?.bidPrice).toFixed(pip),
        askPrice: parseFloat(data?.askPrice).toFixed(pip)
      })

      setOpen_price(parseFloat(data?.askPrice).toFixed(pip))
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
      setOpen_price(parseFloat(data?.response[0]?.c).toFixed(pip))

    } catch (error) {

      console.error(error);
    }
  };

  const handleCheckboxClick = (e) => {
    setConnected(e.target.checked)
    if (symbol?.feed_name === 'binance') {
      fetchData(symbol, e.target.checked, pipVal)
    }
    // if(symbol?.feed_name === 'binance'){
    //   fetchData(symbol, e.target.checked, pipVal)
    // }
    // if(symbol?.feed_name === 'fcsapi'){
    //   fetchData(symbol, e.target.checked, pipVal)
    // }
    // if(!e.target.checked){
    //   setOpen_price(pricing.askPrice)
    // }
  }

  // const fetchFcsapiSocketData = (api_key, currencyIds, pip) => {
  //       // Define callback functions
  //   const onDataReceived = (data) => {
  //     console.log('Data received:', data);
  //   };

  //   const onError = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   const onClose = () => {
  //     console.log('WebSocket connection closed.');
  //   };

  //   // Call establishWebSocketConnection with callbacks
  //   const closeWebSocketConnection = establishWebSocketConnection(api_key, currencyIds, onDataReceived, onError, onClose);

  //   // Close the WebSocket connection when needed
  //     // closeWebSocketConnection();

  // }


  const fetchData = (symbol, connected, pip) => {
   
    const onError = (error) => {
      console.error('WebSocket error:', error);
    };

    const onClose = () => {
      console.log('Previous WebSocket connection closed');
    };

    // const onStop = () => {
    //   console.log('Previous WebSocket connection stopped manually');
    // };
    const binanceStream = BinanceBidAsk(symbol, connected);

    // if((!connected && streamConnected)){

    //   binanceStream.stop(onStop)
    //   setStreamConnected(false)
    //   return
    // }

    // setStreamConnected(true)

    if (binanceStream) {
      const onDataReceived = (data) => {
        try{
          if (!data?.bidPrice) {
            if (symbol?.feed_name === 'binance') {
              fetchBinancehData(symbol?.feed_fetch_name, pip)
            }
            else {
              fetchFcsapiData(symbol, symbol?.feed_fetch_key, pip)
            }
          }
          else {
  
               setPricing({
                  
                 openPrice: parseFloat(data?.bidPrice).toFixed(pip),
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
    // }
    // else {
    //   CustomNotification({ type: "error", title: "Opps", description: `${symbol?.feed_name} not configured yet`, key: 1 })
    // }
  }
  const closeWithdrawOrder = () => {
    setIsModalOpen(false)
  }
  const handleChipClick = (option) => {
    setTimeState(option)
  }
  return (
    <Spin spinning={isLoading} size="large">
      <CustomModal
        isModalOpen={isModalOpen}
        title={'Mass Sell/Buy'}
        // handleOk={handleOk}
        handleCancel={closeWithdrawOrder}
        footer={[]}
        width={400}

      >
        <div
          dangerouslySetInnerHTML={{ __html: error_message }}
        /><br />
        Do You still want to Proceed?
        <div className="mb-4 flex justify-center gap-4 mt-4">
          <CustomButton
            Text={"Cancel"}
            style={{ height: "48px", width: '206px', backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
            onClickHandler={() => setIsModalOpen(false)}
          />
          <CustomButton Text={"Proceed"}
            style={{ height: "48px", width: '206px', borderRadius: "8px" }}
            onClickHandler={() => {
              setIsModalOpen(false)
              handleSubmit(rcvd_type, true)
            }}
          />
        </div>
      </CustomModal>
      <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3 justify-between'>
          <div className='flex gap-3 w-full'>
            {/* <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate(-1)}
            /> */}

            <h1 className='text-3xl font-bold'>Create New Order</h1>
          </div>
          {/* <CustomTextField
            label={'Search'}
            varient={'standard'}
            sx={{ width: '300px' }}
          /> */}
        </div>
        <div className='flex'>
          <div className="flex-1 mr-2 ">
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div>

                <Autocomplete
                  name="Symbol"
                  id="Symbol"
                  variant={'standard'}
                  options={symbolsList}
                  getOptionLabel={(option) => option?.name ? option?.name : ""}
                  value={symbol}
                  onChange={(e, value) => {
                    setLotSize(value?.lot_size)
                    setD_lot(value?.vol_min)
                    const pipValue = checkCurrencyPosition(value, pricing, account_currency)
                    setPipVal(pipValue)
                    setCommission(value?.commission)
                    setVolumeRange({
                      ...volumerange,
                      min_vol: value?.vol_min,
                      max_vol: value?.vol_max
                    })
                    setLotStep(value?.lot_step)
                    setVolume(value?.vol_min)
                    if (value) {
                      setErrors(prevErrors => ({ ...prevErrors, symbol: "" }))
                      setSymbol(value)
                      if (value && connected) {

                        fetchData(value, connected, value?.pip);
                      }

                      else {
                        CustomNotification({ type: "error", title: "Opps", description: `${value?.feed_name} not configured yet`, key: 1 })
                      }

                    }
                    else
                      setSymbol(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Symbol" label="Select Symbol" variant="standard" />
                  }
                />
                {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
              </div>

              <div>
                <Autocomplete
                  name={'Type'}
                  variant={'standard'}
                  label={'Type'}
                  options={TradeOrderTypes.slice(0, 2)}
                  value={order_type}
                  getOptionLabel={(option) => option?.label ? option?.label : ""}
                  onChange={(e, value) => {
                    if (value) {

                      setOrder_type(value)
                      setErrors(prevErrors => ({ ...prevErrors, order_type: "" }))
                    }
                    else
                      setOrder_type(null)
                  }}
                  renderInput={(params) =>
                    <TextField {...params} name="Type" label="Order Type" variant="standard" />
                  }
                />
                {errors.order_type && <span style={{ color: 'red' }}>{errors.order_type}</span>}
              </div>
            </div>

            <div className={`mb-4 grid ${order_type?.value === 'pending' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}  gap-4`}>
              <div>
                {order_type?.value === 'pending' &&
                  <Autocomplete
                    name={'Type'}
                    variant={'standard'}
                    label={'Type'}
                    options={PendingOrderTypes}
                    value={type}
                    getOptionLabel={(option) => option?.label ? option?.label : ""}
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
                }
              </div>

              <div>
                <CustomNumberTextField
                  label="Volume"
                  value={volume}
                  initialFromState={volumerange?.min_vol ? parseFloat(volumerange?.min_vol) : 0.01}
                  onChange={handleVolumeChange}
                  fullWidth
                  // min={0.01}
                  // max={100}
                  min={volumerange?.min_vol ? parseFloat(volumerange?.min_vol) : 0.01}
                  max={volumerange?.max_vol ? parseFloat(volumerange?.max_vol) : 100}
                  step={lotstep ? parseFloat(lotstep) : 0.01}
                // step={0.01}
                />
                {/* <CustomTextField label={'Volume'} varient={'standard'} type="number" sx={numberInputStyle} value={volume} onChange={e => handleInputChange('volume', e.target.value)} /> */}
                {errors.volume && <span style={{ color: 'red' }}>{errors.volume}</span>}
              </div>

            </div>

            <div className="mb-4 grid grid-cols-1  gap-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                {
                  (!connected || order_type?.value === 'pending') ?
                    <div className="flex-1">
                      <CustomTextField
                        label={'Open Price'}
                        value={open_price}
                        type="number"
                        sx={numberInputStyle}
                        varient={'standard'}
                        s_value={true}
                        onChange={(e) => {
                          setOpen_price(e.target.value)
                          const res = parseFloat(symbol?.lot_size) * parseFloat(pricing?.openPrice) / conditionalLeverage(trading_account, symbol)
                          const margin_val = res * parseFloat(volume)
                          setMargin(margin_val)
                        }}
                      />
                      {errors.open_price && <span style={{ color: 'red' }}>{errors.open_price}</span>}
                    </div>
                    :
                    <TradePrice askPrice={pricing?.askPrice ?? ''} />
                  // <TradePrice label={'Open Price / Ask Price'} openPrice={pricing?.openPrice ?? ''} askPrice={pricing?.askPrice ?? ''} />  
                }


                {/* <label className='mt-2'>Auto</label> */}
                {order_type?.value !== 'pending' &&

                  <div className="gap-2 border-b">

                    <CustomCheckbox label='Auto' checked={connected} onChange={handleCheckboxClick} />
                  </div>
                }
              </div>
            </div>

            <div className={`mb-4 grid  ${type?.value === 'Buy Sell Limit' || type?.value === 'Sell Stop Limit' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="flex-1">
                  <CustomStopLossTextField
                    label="Take Profit"
                    value={takeProfit}
                    initialFromState={pricing?.askPrice ? pricing?.askPrice : 0}
                    // checkFirst={pricing?.askPrice ? true : false}
                    checkFirst={takeProfit === '' ? true : false}
                    onChange={handleProfitChange}
                    fullWidth
                    min={0}
                    step={0.1}
                  />
                  {/* <CustomTextField label={'Take Profit'} varient={'standard'} type="number" sx={numberInputStyle} value={takeProfit} onChange={e => handleInputChange('takeProfit', e.target.value)} /> */}
                  {errors.takeProfit && <span style={{ color: 'red' }}>{errors.takeProfit}</span>}
                </div>
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
                {/* <CustomTextField label={'Stop Loss'} varient={'standard'} type="number" sx={numberInputStyle} value={stopLoss} onChange={e => handleInputChange('stopLoss', e.target.value)} /> */}
                {errors.stopLoss && <span style={{ color: 'red' }}>{errors.stopLoss}</span>}
              </div>
              {(type?.value === 'Buy Stop Limit' || type?.value === 'Sell Stop Limit') &&
                <CustomTextField label={'Stop Limit Price'} varient={'standard'} type="number" sx={numberInputStyle} value={stop_limit_price} onChange={e => handleInputChange('stop_limit_price', e.target.value)} />}
            </div>
            {/* <b>Open Price: {pricing?.openPrice ? `(${pricing?.openPrice})` : ''} / Ask Price: {pricing?.askPrice ? `(${pricing?.askPrice})` : ''}</b> */}
            {/* <b> Open Price (Socket) : {pricing?.openPrice} / Ask Price (Socket) : {pricing?.askPrice}</b> <br /> <b> Open Price (Manual) : {manualpricing.openPrice} / Ask Price (Manual): {manualpricing.askPrice}</b> */}
            <div className="mb-4 grid grid-cols-1 gap-4">
              <CustomTextField label={'Comments'}
                value={comment}
                onChange={e => handleInputChange('comment', e.target.value)}
                multiline={true}
                rows={1} />
            </div>
            {order_type?.value === 'pending' ?


              <div className="mb-4 grid grid-cols-1 w-full gap-4">
                <CustomButton
                  Text={"Place Order"}
                  style={{ height: "48px", backgroundColor: "#D52B1E", borderColor: "#D52B1E" }}
                  disabled={(type?.label === "Sell Limit" || type?.label === "Sell Stop") ?
                    (stopLoss > open_price && takeProfit < open_price) ? false : true
                    : (type?.label === "Buy Limit" || type?.label === "Buy Stop") ?
                      (stopLoss < open_price && takeProfit > open_price) ? false : true
                      : (type?.label === "Buy Stop Limit" && stop_limit_price < open_price) ?
                        (stopLoss < stop_limit_price && takeProfit > stop_limit_price) ? false : true : (type?.label === "Sell Stop Limit" && stop_limit_price > open_price) ? (stopLoss > stop_limit_price && takeProfit < stop_limit_price) ? false : true : true}
                  onClickHandler={() => handleSubmit('')}
                />
              </div>
              :
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                <CustomButton
                  Text={`Sell ${pricing.askPrice ? `(${pricing.askPrice})` : ''}`}
                  style={{ height: "48px", width: "100%", backgroundColor: "#D52B1E", borderColor: "#D52B1E" }}
                  // disabled={connected ? (stopLoss > pricing.askPrice && takeProfit < pricing.askPrice) ? false : true : (stopLoss > open_price && takeProfit < open_price) ? false : true}
                  onClickHandler={() => handleSubmit('sell')}
                />
                <CustomButton Text={`Buy ${pricing.openPrice ? `(${pricing.openPrice})` : ''}`}
                  style={{ height: "48px", width: "100%" }}
                  // disabled={connected ? (stopLoss < pricing.askPrice && takeProfit > pricing.askPrice) ? false : true : (stopLoss < open_price && takeProfit > open_price) ? false : true}
                  onClickHandler={() => handleSubmit('buy')}
                />
              </div>
            }
          </div>
          <div className="flex-1 ml-2 ">
            <div className="mb-4">
              {
                <Paper
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                  }}
                >
                  {TradeTimeChips.map((option, index) => {
                    const isSelected = time_state === option;
                    return (
                      <ListItem
                        key={option}>
                        <Chip
                          disabled={!symbol?.feed_fetch_name || loading}
                          label={`${option}`}
                          onClick={() => handleChipClick(option)}
                          style={{ backgroundColor: isSelected ? '#1CAC70' : 'default', color: isSelected ? '#fff' : 'default' }}
                        />
                      </ListItem>
                    )
                  })}


                </Paper>
              }
              <CandleStickChart
                interval={time_state}
                symbol={symbol}
                connected={true}
                pricing={pricing}
                setLoading={setLoading}
              />
              <div className='flex flex-col bg-white shadow-lg rounded-lg p-2 text-md font-bold text-gray-400 gap-3'>
                <div className='flex justify-between'>
                  <span >{d_lot} Lots</span>
                  <span>{parseFloat(lot_size)?.toFixed(2)} units</span>
                </div>
                <div className='flex justify-between'>
                  <span >Pips Value</span>
                  <span>{CurrencyName} {parseFloat(pipVal)?.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span >Required Margin</span>
                  <span>{isNaN(margin) ? "0.00" : parseFloat(margin)?.toFixed(2)}</span>
                </div>

              </div>
              {/* <BinanceBidAsk symbol={"BTCUSD"}/> */}
            </div>
            {/* Your chart content */}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default Trade