import React, { useState, useEffect } from 'react'
import { Space, theme, Spin } from 'antd';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Delete_Trade_Order, Get_Trade_Order, Search_Live_Order } from '../../utils/_TradingAPICalls';
import { ColumnSorter, ColumnSpaceSorter, CustomDeleteDeleteHandler, calculateNights, calculateNumOfPip, calculateProfitLoss, checkNaN, getCurrentDateTime, getOpenPriceFromAPI } from '../../utils/helpers';
import { setLiveOrdersSelectedIds, setLiveOrdersData, } from '../../store/TradeOrders';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png';
import { values } from 'lodash';
import { Live_Order } from '../../utils/BackendColumns';
import { Export_Live_Order } from '../../utils/ExportColumns';
import BinanceBidAsk from '../../websockets/BinanceBidAsk';
import axios from 'axios';

const LiveOrders = () => {
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state) => state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, colorPrimary, TableHeaderColor } } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)

  const [liveOrders, setLiveOrders] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isUpdated, setIsUpdated] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [SearchQueryList, SetSearchQueryList] = useState({})


  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const fetchLiveOrder = async (brandId, page) => {
    setIsLoading(true)
    const params = { OrderTypes: ['market'], token, brandId, page }
    const mData = await Get_Trade_Order(params, page)
    const { data: { message, payload, success } } = mData
    const allLiveOrders = payload?.data?.map((order) => ({
      id: order.id,
      trading_account_loginId: order.trading_account_loginId,

      symbol: order.symbol,
      open_time: moment(order.open_time).format('D MMMM YYYY h:mm A'),
      type: order.type,
      volume: order.volume,
      open_price: order.open_price,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      reason: order.reason ? order.reason : '...',
      swap: order.swap ? order.swap : '...',
      profit: order.profit ? order.profit : '...',
      comment: order.comment

    }))
    setIsLoading(false)
    if (success) {
      setLiveOrders(allLiveOrders)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setIsUpdated(false)

    }
  }
  const onPageChange = (page) => {
    if (userRole === 'brand') {
      fetchLiveOrder(userBrand.public_key, page)
    }
    else {
      fetchLiveOrder(null, page)
    }
  }


  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])

  useEffect(() => {
    setIsUpdated(true)
    if (userRole === 'brand') {
      SetSearchQueryList({ brand_id: userBrand.public_key })
    }

  }, [])


  const [isReCalculate, setIsReCalculate] = useState(false)

  const [pricing, setPricing] = React.useState({});


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
  
          setPricing((prev) => ({
            ...prev,
            [order?.id]: {
            bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
            askPrice: parseFloat(data?.askPrice).toFixed(pip)
            }
          }));
  
  
          
          }
        }catch(error){
          console.error("Error in onDataReceived:", error)
        }
      };

      binanceStream.start(onDataReceived, onError, onClose);
      // Optionally, stop the WebSocket connection when it's no longer needed  
      // binanceStream.stop();
    };
  

  };


  const setLiveManipulatedData = async (data) => {
    const currentDateTime = getCurrentDateTime();
 
    const updatedData = await Promise.all(data.map(async (x) => {

      const pipVal = x?.symbol_setting?.pip ? x?.symbol_setting?.pip : 5;
      if(!pricing?.[x?.id]?.askPrice){
        await fetchDataForSymbol(x,pipVal)
      }
      const res = (parseFloat(parseFloat(x?.volume) * parseFloat(x?.symbol_setting?.lot_size) * x?.open_price).toFixed(2));
      const open_price = parseFloat(x?.open_price).toFixed(pipVal);
      const currentPrice = x?.type === "sell" ? parseFloat(pricing?.[x?.id]?.askPrice).toFixed(pipVal) ?? 0 : parseFloat(pricing?.[x?.id]?.bidPrice).toFixed(pipVal) ?? 0;
      const profit = calculateProfitLoss(parseFloat(calculateNumOfPip(currentPrice, parseFloat(x?.open_price), x?.type, parseInt(pipVal))).toFixed(2), parseFloat(x?.volume));
      const totalNights = calculateNights(x?.created_at, currentDateTime);
      const Calswap = parseFloat(x?.volume) * totalNights * parseFloat(x?.symbol_setting?.swap ?? 0.00);
      const swap = Calswap > 0 ? -Calswap : Calswap;
      return { ...x, commission:parseFloat(x?.symbol_setting?.commission ?? 0.00), swap, profit:checkNaN(profit), currentPrice:checkNaN(currentPrice), open_price };
    }));


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
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
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
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }
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
      title: <span className="dragHandler">Brand Name</span>,
      dataIndex: 'brand_name',
      key: '2222',
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
      sorter: (a, b) => ColumnSorter(a.type, b.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '5',
      sorter: (a, b) => a.volume - b.volume,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '6',
      sorter: (a, b) => a.open_price - b.open_price,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Open Time</span>,
      dataIndex: 'open_time',
      key: '7',
      sorter: (a, b) => a.open_time - b.open_time,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
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
      title: <span className="dragHandler">Stop Loss</span>,
      dataIndex: 'stopLoss',
      key: '10',
      sorter: (a, b) => a.stopLoss - b.stopLoss,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Comment</span>,
      dataIndex: 'comment',
      key: '11',
      sorter: (a, b) => ColumnSorter(a.comment - b.comment),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '12',
      sorter: (a, b) => ColumnSorter(a.swap - b.swap),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '13',
      render: (text) => <span className={`${parseFloat(text) < 0 ? 'text-red-600' : 'text-green-600'}`}>{parseFloat(text).toFixed(2)}</span>
    },
    {
      title: <span className="dragHandler">Commission</span>,
      dataIndex: 'commission',
      key: '14',
      render: (text) => <span className={`${text < 0 ? 'text-red-600' : 'text-green-600'}`}>{text}</span>
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>

    //         <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=> CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order,setIsLoading,fetchLiveOrder)} />

    //     </Space>
    //   ),
    // },
  ];

  const backend_columns = [
    { value: "id", label: "OrderId" },
    { value: "type", label: "Type" },
    { value: "volume", label: "Volume" },
    { value: "open_price", label: "Open Price" },
    { value: "open_time", label: "Open Time" },
    { value: "currentPrice", label: "Current Price" },
    { value: "profit", label: "Profit" },
    { value: "stopLoss", label: "Stop Loss" },
    { value: "comment", label: "Comment" },
    { value: "swap", label: "Swap" },
    { value: "commission", label: "Commission" },
  ]

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(columns)



  useEffect(() => {
    setIsUpdated(true)
    if (userRole === 'brand') {
      fetchLiveOrder(userBrand.public_key, CurrentPage)
    }
    else {
      fetchLiveOrder(null, CurrentPage)
    }

  }, [perPage])


  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
        <h1 className='text-2xl font-bold'>Live Orders</h1>

        <CustomTable
          direction="/live-orders-entry"
          formName="Live Orders"
          columns={newColumns}
          data={liveOrders}
          headerStyle={headerStyle}
          total={totalRecords}
          setTotalRecords={setTotalRecords}
          onPageChange={onPageChange}
          current_page={CurrentPage}
          token={token}
          isUpated={isUpdated}
          setSelecetdIDs={setLiveOrdersSelectedIds}
          setTableData={setLiveOrdersData}
          table_name="trade_orders"
          setSortDirection={setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery={Search_Live_Order}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          searchQueryManipulation={setLiveManipulatedData}
          setLastPage={setLastPage}
          editPermissionName="live_orders_update"
          deletePermissionName="live_orders_delete"
          backendColumns={Live_Order}
          exportColumns={Export_Live_Order}
          isReCalculate={isReCalculate}
        />
      </div>
    </Spin>
  )

}
export default LiveOrders