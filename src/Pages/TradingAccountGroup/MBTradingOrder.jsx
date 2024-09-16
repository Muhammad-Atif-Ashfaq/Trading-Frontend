import React, { useEffect, useState } from 'react'
import { PlusCircleOutlined, EditOutlined, DeleteOutlined,CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons';

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Space, theme, Spin } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { GET_Group_Trade_Order } from '../../utils/_TradeOrderAPI';
import { useSelector } from 'react-redux';
import { setTradeGroupsData, setTradeGroupsSelectedIDs,setCurrentTradeGroupData } from '../../store/tradeGroupsSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
// import { Spin } from 'antd';

const MBTradingOrder = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const trading_group_id = useSelector((state) => state?.tradingAccountGroup?.selectedRowsIds ? state?.tradingAccountGroup?.selectedRowsIds[0] : 0)
  const {token: { colorBG, TableHeaderColor, colorPrimary },} = theme.useToken();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [tradeOrder, setTradeOrder] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  

  const FetchTradeGroup = async () => {
    try{
    setIsLoading(true)
    const mData = await GET_Group_Trade_Order(token, trading_group_id)
    const { data: { message, payload, success } } = mData
      setIsLoading(false)
      setTradeOrder(payload.data)
      setTotalRecords(payload.total)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setIsUpdated(false)
    }
    catch (error) {
      console.error('Error fetching trade Deposit groups:', error);
    }
  }

  const onPageChange = () =>{
    // FetchTradeGroup()
  }

  // useEffect(() => {
  //   FetchTradeGroup()
  // }, [])

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };
  const columns = [
    {
      title:<span className="dragHandler">Symbol</span> ,
      dataIndex: 'symbol',
      key: '1',
      sorter:(a, b) => ColumnSorter(a?.symbol , b?.symbol),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:<span className="dragHandler">Open Time</span> ,
      dataIndex: 'open_time',
      key: '2',
      sorter:(a, b) => ColumnSorter(a?.open_time , b?.open_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Close Time</span>,
      dataIndex: 'close_time',
      key: '3',
      sorter:(a, b) => ColumnSorter(a?.close_time , b?.close_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      
    },
    {
      title:<span className="dragHandler">Type</span> ,
      dataIndex: 'type',
      key: '4',
      sorter:(a, b) => ColumnSorter(a?.type , b?.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Volume</span> ,
      dataIndex: 'volume',
      key: '5',
      sorter:(a, b) => a?.volume - b?.volume,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Open Price</span>,
      dataIndex: 'open_price',
      key: '6',
      sorter:(a, b) => a?.open_price - b?.open_price,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:  <span className="dragHandler">SL</span>,
      dataIndex: 'stopLoss',
      key: '7',
      sorter:(a, b) => a?.stopLoss - b?.stopLoss,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">TP</span>,
      dataIndex: 'takeProfit',
      key: '8',
      sorter:(a, b) => a?.takeProfit - b?.takeProfit,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Close Price</span>,
      dataIndex: 'close_price',
      key: '9',
      sorter:(a, b) => a?.close_price - b?.close_price,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title:  <span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '10',
      sorter:(a, b) => a?.profit - b?.profit,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <Link to="/trading-group/mb-to/0/0"><EditOutlined style={{ fontSize: "24px", color: colorPrimary }} /></Link>
    //       <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} />
    //     </Space>
    //   ),
    // },
  ];

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  const [SearchQueryList,SetSearchQueryList]= useState({})

  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  const data = [
    {
      key: '1',
      Symbol: 'Symbol A',
      Time: '10:00',
      Type: 'Type A',
      Volume: '100',
      Price: '50',
      SL: '45',
      TP: '55',
      Price2: '60',
      Profit: '20%',
    },
    {
      key: '2',
      Symbol: 'Symbol B',
      Time: '11:00',
      Type: 'Type B',
      Volume: '200',
      Price: '55',
      SL: '50',
      TP: '60',
      Price2: '65',
      Profit: '15%',
    },
    // Add more data objects as needed
  ];


  useEffect(() => {
      SetSearchQueryList({trading_group_id})
  }, [])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex gap-3 justify-between'>
          <div className='flex gap-3'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate(-2)}
            />

            <h1 className='text-3xl font-bold'>Mass Buy/Sell Trading Order</h1>
          </div>
          <CustomButton
            Text='Create New Order'
            style={{
              padding: '16px',
              height: '48px',
              borderRadius: '8px',
            }}
            onClickHandler={() => navigate('/trading-group/mb-to/create')}
          />
        </div>
        <CustomTable 
            direction="/trading-group/mb-to-entry"
            columns={newColumns}
            column_name="group_unique_id" 
            // data={tradeOrder} 
            headerStyle={headerStyle} 
            formName = "Mass Buy"
            total={totalRecords}
            setTotalRecords={setTotalRecords}
            onPageChange = {onPageChange}
            current_page={CurrentPage}
            token = {token}
            isUpated={isUpdated}
            setSelecetdIDs={setTradeGroupsSelectedIDs}
            setTableData = {setTradeGroupsData}
            setCurrentData={setCurrentTradeGroupData}
            table_name= "trade_orders"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {GET_Group_Trade_Order}
            SearchQueryList={SearchQueryList}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage} 
        />

      </div>
    </Spin>
  )
}

export default MBTradingOrder