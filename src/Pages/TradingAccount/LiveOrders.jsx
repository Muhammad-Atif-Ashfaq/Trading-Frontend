import { theme, Spin, Table, Space } from 'antd';
import React, { useState, useEffect } from 'react'
import CustomTable from '../../components/CustomTable';
import { MinusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { Get_Single_Trading_Account, Put_Trade_Order, Put_Trading_Account, Search_Live_Order } from '../../utils/_TradingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import CustomNotification from '../../components/CustomNotification';
import { CurrenciesList, LeverageList } from '../../utils/constants';
import { calculateEquity, calculateFreeMargin, calculateMargin, calculateMarginCallPer, calculateNights, calculateNumOfPip, calculateProfitLoss, checkNaN, ColumnSorter, conditionalLeverage, getCurrentDateTime, getValidationMsg } from '../../utils/helpers';
import { GenericDelete, UpdateMultiTradeOrder } from '../../utils/_APICalls';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png';
import { setLiveOrdersSelectedIds, setLiveOrdersData } from '../../store/TradingAccountListSlice';
import { CloseOutlined, DeleteOutlined } from '@mui/icons-material';
import { EyeOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { updateMultipleFields, updateTradingAccountGroupBalance } from '../../store/tradingAccountGroupSlice';
import { Trading_Accounts_Live_Order } from '../../utils/BackendColumns';
import {  Export_Trading_Accounts_Live_Order } from '../../utils/ExportColumns';
import BinanceBidAsk from '../../websockets/BinanceBidAsk';
import axios from 'axios';
import usePusher from '../../pusher/usePusher';

const LiveOrders = ({  isLoading, setIsLoading }) => {

  const dispatch = useDispatch()
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds ? state?.trade?.selectedRowsIds[0] : 0);
  const token = useSelector(({ user }) => user?.user?.token)
  const liveOrdersData = useSelector(({ tradingAccount }) => tradingAccount.liveOrdersData)
  const { balance, currency, leverage, brand_margin_call, id, credit, bonus, total_withdraw, commission, tax } = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData)
  // const prev_data = useSelector((state)=>state.tradingAccountGroup.tradingAccountGroupData)
  const { value: accountLeverage } = LeverageList?.find(x => x.title === leverage) || { value: '', title: '' }
  const { title: CurrencyName } = CurrenciesList?.find(x => x.value === currency) || { label: 'Dollar ($)', value: '$', title: 'USD' }
  const location = useLocation()
  const { pathname } = location

  
  const tradeOrderUpdation = usePusher('trade_orders','update')

  
  //check
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isUpdated, setIsUpdated] = useState(true)
  const [perPage, setPerPage] = useState(10)
  const [SearchQueryList, SetSearchQueryList] = useState({})
  const [sortDirection, setSortDirection] = useState("")
  const [refresh_data, setRefreshData] = useState(false)

  const [grandProfit, setGrandProfit] = useState(0);
  const [grandVolumn, setGrandVolumn] = useState(0); 
  const [grandMargin, setGrandMargin] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0)
  const [totalSwap, setTotalSwap] = useState(0);
  const [isReCalculate, setIsReCalculate] = useState(false)

  const equity_g = calculateEquity(balance, grandProfit, credit, bonus)
  const free_margin = calculateFreeMargin(equity_g, grandMargin)
  const margin_level = calculateMarginCallPer(equity_g, grandMargin)

  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();

  const [pricing, setPricing] = React.useState({});
  let margin;

  const fetchBinanceData = async (order, pip) => {
 
  try {
    const endPoint= `${import.meta.env.VITE_BINANCE_API}?symbol=${order?.symbol_setting?.feed_fetch_name}`
    const response = await axios.get(endPoint);
    const data = response?.data;
     
      setPricing((prev) => ({
        ...prev,
        [order?.id]: {
          bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
          askPrice: parseFloat(data?.askPrice).toFixed(pip)
        }
      }));
      return data;
    
   
  } catch (error) {
    console.error(error);
  }
};
const fetchFcsapiData = async (order, key, pip) => {
  
  try {
   
    const endPoint1= `${import.meta.env.VITE_FSCI_API}${key}/latest?symbol=${order?.symbol_setting?.feed_fetch_name}&access_key=${order?.symbol_setting?.data_feed?.feed_login}`

    
      const response = await axios.get(endPoint1);
      const data = response?.data;


      setPricing((prev) => ({
        ...prev,
        [order?.id]: {
          bidPrice: parseFloat(data?.response[0]?.o).toFixed(pip),
          askPrice: parseFloat(data?.response[0]?.c).toFixed(pip)
        }
      }));
   
  } catch (error) {
    // setError('Error fetching data');
    console.error(error);
  }
};

 const fetchDataForSymbol = async (order, pip) => {

  

  const onError = (error) => {
      console.error('WebSocket error:', error);
    };

    const onClose = () => {
      console.log('Previous WebSocket connection closed');
    };

    const binanceStream = BinanceBidAsk(order?.symbol_setting, true);
    
    if (binanceStream) {
      
      const onDataReceived = (data) => {
        try{
          if(!data?.bidPrice){
            if(order?.symbol_setting?.feed_name === 'binance'){
              fetchBinanceData(order, pip)
            }
            else{ 
              fetchFcsapiData(order, order?.symbol_setting?.feed_fetch_key, pip)
            }
          }
          else {
          console.log('Fcsapi Data here')
          setPricing((prev) => ({
            ...prev,
            [order?.id]: {
            bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
            askPrice: parseFloat(data?.askPrice).toFixed(pip)
            }
          }));
  
  
    
        
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


const setLiveManipulatedData = async (data) => {
  
    let totalProfit = 0.00;
    let totalVolumn = 0.00;
    let totalMargin = 0.00;
     let _totalSwap = 0.00;
    let t_commission = 0.00;
  
  const currentDateTime = getCurrentDateTime();
  const updatedData = await Promise.all(data?.map(async (x) => { 

      // const  { askPrice, bidPrice } = await getOpenPriceFromAPI(x?.symbol, x?.feed_name);
      const pipVal = x?.symbol_setting?.pip ? x?.symbol_setting?.pip : 5;
      if(!pricing?.[x?.id]?.askPrice){
        await fetchDataForSymbol(x,pipVal)
      }
 
      const res = (parseFloat(parseFloat(x?.volume) * parseFloat(x?.symbol_setting?.lot_size) * x?.open_price).toFixed(2));
      margin = calculateMargin(res, conditionalLeverage(x?.trading_account,x?.symbol_setting));
      const open_price = parseFloat(x?.open_price).toFixed(pipVal);
   
      const currentPrice = x?.type === "sell" ? parseFloat(pricing?.[x?.id]?.askPrice).toFixed(pipVal) ?? 0 : parseFloat(pricing?.[x?.id]?.bidPrice).toFixed(pipVal) ?? 0;
      const profit = calculateProfitLoss(parseFloat(calculateNumOfPip(currentPrice, parseFloat(x?.open_price), x?.type, parseInt(pipVal))).toFixed(2), parseFloat(x?.volume));
      totalProfit += parseFloat(profit);
      const totalNights = calculateNights(x?.created_at, currentDateTime);
      const Calswap = parseFloat(x?.volume) * totalNights * parseFloat(x?.symbol_setting?.swap ?? 0.00);
      _totalSwap += parseFloat(Calswap ?? 0.00);
      const swap = Calswap > 0 ? -Calswap : Calswap; 
      const comm = parseFloat(x?.symbol_setting?.commission ?? 0.00);
      t_commission += comm;
      totalMargin += parseFloat(margin);
      totalVolumn += parseFloat(res);
      
      return { ...x, commission:parseFloat(x?.symbol_setting?.commission ?? 0.00), swap, profit:checkNaN(profit), currentPrice:currentPrice, open_price };
      
    }));
    
    setGrandProfit(totalProfit.toFixed(2));
    setGrandVolumn(totalVolumn.toFixed(2));
    setGrandMargin(totalMargin.toFixed(2));
    setTotalSwap(_totalSwap.toFixed(2));
    setTotalCommission(t_commission.toFixed(2));

    return updatedData;
  
}
React.useEffect(()=>{
  setIsReCalculate(!isReCalculate)
},[pricing])



  const columns = [
    {
      title: <span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol_setting_name',
      key: '1',
      sorter: (a, b) => ColumnSorter(a.symbol_setting_name, b.symbol_setting_name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">LoginID</span>,
      dataIndex: 'trading_account_loginId',
      key: '2',
      sorter: (a, b) => ColumnSorter(a.trading_account_loginId, b.trading_account_loginId),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">OrderID</span>,
      dataIndex: 'id',
      key: '3',
      sorter: (a, b) => a?.id - b?.id,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },

    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '4',
      render: (text) => <span className={`${text === "sell" ? 'text-red-600' : 'text-green-600'}`}>{text}</span>,
      sorter: (a, b) => ColumnSorter(a.type, b.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },

    },
    {
      title: <span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '5',

      sorter: (a, b) => ColumnSorter(a.volume, b.volume),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
      render: (text) => <span style={{ color: "red" }}>{text}</span>
    },
    {
      title: <span className="dragHandler">Open Time</span>,
      dataIndex: 'open_time',
      key: '6',

      sorter: (a, b) => ColumnSorter(a.open_time, b.open_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
      render: (text) => <span>{moment(text).format('D MMMM YYYY h:mm:ss A')}</span>

    },
    {
      title: <span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '7',
      sorter: (a, b) => ColumnSorter(a.open_price, b.open_price),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    //
    {
      title: <span className="dragHandler">Current Price</span>,
      dataIndex: 'currentPrice',
      key: '8',
      sorter: (a, b) => ColumnSorter(a.currentPrice, b.currentPrice),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Take Profit</span>,
      dataIndex: 'takeProfit',
      key: '9',
      sorter: (a, b) => ColumnSorter(a.takeProfit, b.takeProfit),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },

    {
      title: <span className="dragHandler">Stop Loss</span>,
      dataIndex: 'stopLoss',
      key: '10',
      sorter: (a, b) => ColumnSorter(a.stopLoss, b.stopLoss),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },

    {
      title: <span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '11',
      sorter: (a, b) => ColumnSorter(a.comment, b.comment),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '12',
    },
    {
      title: <span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '13',
      render: (text) => <span className={`${text < 0 ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
    },
    {
      title: <span className="dragHandler">Commission</span>,
      dataIndex: 'commission',
      key: '14',
      render: (text) => <span className={`${text < 0 ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
    },

    {
      title: 'Actions',
      dataIndex: 'actions',
      key: '15',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }}
            onClick={(e) => {
              e.stopPropagation();
              closeHandler(record);
            }}
          />
          <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} />
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }}
            onClick={(e) => {
              e.stopPropagation();
              deleteHandler(record.id);
            }}
          />
        </Space >

      ),
    },
  ];
  const deleteHandler = async (id) => {
    const params = {
      table_name: "trade_orders",
      table_ids: [id]
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        const res = await GenericDelete(params, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if (success) {
          setRefreshData(true)
          CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
        }
        else {
          const errorMsg = getValidationMsg(message, payload)
          if (errorMsg)
            CustomNotification({
              type: "error",
              title: "Oppssss..",
              description: errorMsg,
              key: "b4",
            })
          else
            CustomNotification({
              type: "error",
              title: "Oppssss..",
              description: message,
              key: "b4",
            })
        }
      }
    })


  }

  const closeHandler = async (record) => {
    const modifiedData = [{
      ...record,
      order_type: 'close'
    }]

    const Params = { orders: modifiedData }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        const res = await UpdateMultiTradeOrder(Params, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if (success) {
          // const res = await Search_Live_Order(token,CurrentPage,totalRecords, SearchQueryList  )
          // dispatch(setLiveOrdersData(res?.data?.payload?.data))
          const updated_balance = Number(balance) + Number(record.profit)
          dispatch(updateTradingAccountGroupBalance(updated_balance))
          setRefreshData(true)
          CustomNotification({
            type: "success",
            title: "Order Closed",
            description: message,
            key: "a4",
          })
        } else {
          CustomNotification({
            type: "error",
            title: "Oppssss..",
            description: message,
            key: "b4",
          })
        }

      }
    })

  }

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(columns)

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };


  const onPageChange = (page) => {
    // fetchLiveOrder(page)
  }
  // const CancelLiveOrder = async (id) => {

  //  const requiredOrder = tradeOrder.find((order)=>order.id === id)

  //   setIsLoading(true)
  //   const currentDateISO = new Date().toISOString();
  //   // const currentDate = new Date(currentDateISO);
  //   // const formattedDate = moment(currentDate).format('MM/DD/YYYY HH:mm');
  //   const closeOrderData = {
  //       order_type : 'close',
  //       close_time: currentDateISO,
  //       close_price : requiredOrder.open_price

  //     }
  //     try{
  //       const res = await Put_Trade_Order(id,closeOrderData, token)
  //       const { data: { message, payload, success } } = res
  //       if (success) {

  //       CustomNotification({ type: "success", title: "Live Order", description: message, key: 1 })
  //       fetchLiveOrder(page)       

  //     }
  //     else {

  //       CustomNotification({ type: "error", title: "Live Order", description: message, key: 1 })

  //     }
  //     }catch(error){
  //       CustomNotification({ type: "error", title: "Live Order", description: error.message, key: 1 })

  //     }

  // }

  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  useEffect(() => {
    
    SetSearchQueryList({ trading_account_id, order_types: ['market'] })
  }, [])

useEffect(() => {
    setTimeout(()=>{
      UpdateTradingAccountStatus()
    },50000)
}, [])

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])

  useEffect(()=>{
      setRefreshData(true)
  },[
    tradeOrderUpdation
  ])


  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (liveOrdersData.length > 0) {
          const modifiedData = liveOrdersData.map(item => {
            return {
              ...item,
              order_type: ''
            };
          });
          const Params = { orders: modifiedData }
          const res = await UpdateMultiTradeOrder(Params, token);
        }

      } catch (error) {
        console.error('Error calling API:', error);
      }
    }, 100000); // Interval set to 1000ms (1 second)
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  //#region Update Trading Account 
  const UpdateTradingAccountStatus = async () => {
    const Params = {
      margin_level_percentage: checkNaN(margin_level),
      equity: checkNaN(equity_g),
      commission: checkNaN(totalCommission),
      profit: checkNaN(grandProfit),
      swap: checkNaN(totalSwap),
      free_margin: checkNaN(free_margin),
      ...(margin_level < brand_margin_call && { status: "margin_call" })
    }
    const res = await Put_Trading_Account(id, Params, token)
    dispatch(updateMultipleFields(Params))
  }
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <CustomTable
          direction="/single-trading-accounts/details/live-order-entry"
          formName="Trading Live Orders"
          columns={columns}
          // data={tradeOrder} 
          headerStyle={headerStyle}
          total={totalRecords}
          setTotalRecords={setTotalRecords}
          onPageChange={onPageChange}
          current_page={CurrentPage}
          token={token}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row className='bg-gray-300'>
                <Table.Summary.Cell index={0} colSpan={12}>
                  <span className='text-sm font-bold text-arial'>
                    <MinusCircleOutlined />
                    Balance: {checkNaN(balance)} {CurrencyName} &nbsp;
                    Equity: {checkNaN(equity_g)} &nbsp;
                    Credit: {checkNaN(credit)}  &nbsp;
                    Bonus: {checkNaN(bonus)}  &nbsp;
                    <span> Margin: {checkNaN(margin)}</span>&nbsp;
                    Free Margin: {checkNaN(free_margin)} &nbsp;
                    <span>Margin Level: {checkNaN(margin_level)} %</span> &nbsp;
                    Total Withdraw: {checkNaN(total_withdraw)}  &nbsp;
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell>{checkNaN(totalSwap)}</Table.Summary.Cell>
                <Table.Summary.Cell>{checkNaN(grandProfit)}</Table.Summary.Cell>
                <Table.Summary.Cell>{checkNaN(totalCommission)}</Table.Summary.Cell>

                <Table.Summary.Cell></Table.Summary.Cell>

              </Table.Summary.Row>
            </Table.Summary>
          )}
          isUpated={isUpdated}
          setSelecetdIDs={setLiveOrdersSelectedIds}
          setTableData={setLiveOrdersData}
          table_name="trade_orders"
          setSortDirection={setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery={Search_Live_Order}
          searchQueryManipulation={setLiveManipulatedData}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
          refreshData={refresh_data}
          editPermissionName="live_orders_update"
          deletePermissionName="live_orders_delete"
          setRefreshData={setRefreshData}
          backendColumns={Trading_Accounts_Live_Order}
          exportColumns={Export_Trading_Accounts_Live_Order}
          isReCalculate={isReCalculate}
        />
      </div>
    </Spin>
  )
}

export default LiveOrders