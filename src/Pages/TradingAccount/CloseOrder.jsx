import React, { useState, useEffect } from 'react'
import { Space, theme, Spin, Table } from 'antd';
import { CaretUpOutlined, CaretDownOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Delete_Trade_Order, Get_Trade_Order, Search_Close_Order } from '../../utils/_TradingAPICalls';
import { CustomDeleteDeleteHandler, checkNaN } from '../../utils/helpers';
import { setCloseOrdersSelectedIds, setCloseOrdersData } from '../../store/TradingAccountListSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png';
import { ColumnSorter } from '../../utils/helpers';
import { MinusCircleOutlined } from '@ant-design/icons';
import { CurrenciesList } from '../../utils/constants';
import { Trading_Accounts_Close_Order } from '../../utils/BackendColumns';
import {  Export_Trading_Accounts_Close_Order } from '../../utils/ExportColumns';
import usePusher from '../../pusher/usePusher';


const CloseOrder = ({ setManipulatedData, totalSwap, grandProfit, grandCommsion }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary }, } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [closeOrders, setCloseOrders] = useState([])
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds[0])
  const { balance, currency, leverage, brand_margin_call, id, credit, bonus, commission, tax } = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData)
  const { title: CurrencyName } = CurrenciesList?.find(x => x.value === currency) || { label: 'Dollar ($)', value: '$', title: 'USD' }
  const [refresh_data, setRefreshData] = useState(false)

  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const [isUpdated, setIsUpdated] = useState(true)
  const [perPage, setPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("")
  const [SearchQueryList, SetSearchQueryList] = useState({})

  

  const tradeOrderUpdation = usePusher('trade_orders','update')

  const fetchCloseOrder = async (page) => {
    setIsLoading(true)
    const params = { trading_account_id, OrderTypes: ['close'], token, page }
    const mData = await Get_Trade_Order(params)
    const { data: { message, payload, success } } = mData

    const orders = payload?.data?.map((order) => ({
      id: order.id,
      open_time: moment(order.open_time).format('D MMMM YYYY h:mm:ss A'),
      order_no: order.id,
      type: order.type,
      volume: order.volume,
      symbol: order.symbol,
      open_price: order.open_price,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      close_time: moment(order.close_time).format('D MMMM YYYY h:mm:ss A'),
      close_price: order.close_price,
      reason: order.reason ? order.reason : '...',
      swap: order.swap ? order.swap : '...',
      profit: order.profit ? order.profit : '...'


    }))
    setIsLoading(false)
    if (success) {

      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

      setCloseOrders(orders)
    }

  }


  const onPageChange = (page) => {
    fetchCloseOrder(page)
  }
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
      title: <span className="dragHandler">OrderID</span>,
      dataIndex: 'id',
      key: '22222',
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
      key: '2',
      sorter: (a, b) => ColumnSorter(a.type - b.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      render: (text) => <span className={`${text === "sell" ? 'text-red-600' : 'text-green-600'}`}>{text}</span>

    },
    // {
    //   title:<span className="dragHandler">Order No</span>,
    //   dataIndex: 'order_no',
    //   key: '2',
    //   sorter: (a, b) => a.order_no.length - b.order_no.length,
    //   sortDirections: ['ascend'],
    // },
    {
      title: <span className="dragHandler">Volume</span>,
      dataIndex: 'volume',
      key: '3',
      sorter: (a, b) => a.volume - b.volume,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Take Profit</span>,
      dataIndex: 'takeProfit',
      key: '4',
      sorter: (a, b) => a.takeProfit - b.takeProfit,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Stop Loss</span>,
      dataIndex: 'stopLoss',
      key: '5',
      sorter: (a, b) => a.stopLoss - b.stopLoss,
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
      title: <span className="dragHandler">Close Price</span>,
      dataIndex: 'close_price',
      key: '10',
      sorter: (a, b) => a.close_price - b.close_price,
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
      key: '4',
      sorter: (a, b) => ColumnSorter(a.open_time, b.open_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Close Time</span>,
      dataIndex: 'close_time',
      key: '9',
      sorter: (a, b) => a.close_time - b.close_time,
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
      key: '8',
      sorter: (a, b) => a.comment - b.comment,
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
    // {
    //   title:<span className="dragHandler">Reason</span>,
    //   dataIndex: 'reason',
    //   key: '11',
    //   sorter: (a, b) => a.reason.length - b.reason.length,
    //   sortDirections: ['ascend'],
    // },

    {
      title: 'Actions',
      dataIndex: 'actions',
      key: '15',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <EditOutlined  style={{ fontSize: "24px", color: colorPrimary }} />
          <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }}  onClick={(e)=> {
            e.stopPropagation();
            CustomDeleteDeleteHandler(record.id, token, Delete_Trade_Order,setIsLoading,fetchCloseOrder)}} /> 
        </Space>
      ),
    },
    
  ];

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(columns)

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])


  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);



  useEffect(() => {
    SetSearchQueryList({ trading_account_id, order_types: ['close'] })

  }, [])

   useEffect(()=>{
      setRefreshData(true)
  },[
    tradeOrderUpdation
  ])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <CustomTable
          direction="/single-trading-accounts/details/close-order-entry"
          formName="Trading Close Orders"
          columns={columns}
          // data={closeOrders} 
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
                    Credit: {checkNaN(credit)} {CurrencyName} &nbsp;
                    Bonus: {checkNaN(bonus)} {CurrencyName} &nbsp;
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell>{checkNaN(totalSwap)}</Table.Summary.Cell>
                <Table.Summary.Cell>{checkNaN(grandProfit)}</Table.Summary.Cell>
                <Table.Summary.Cell>{checkNaN(grandCommsion)}</Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
          isUpated={isUpdated}
          setSelecetdIDs={setCloseOrdersSelectedIds}
          setTableData={setCloseOrdersData}
          table_name="trade_orders"
          setSortDirection={setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          refreshData={refresh_data}
          setRefreshData={setRefreshData}
          SearchQuery={Search_Close_Order}
          searchQueryManipulation={setManipulatedData}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
          editPermissionName="close_orders_update"
          deletePermissionName="close_orders_delete"
          backendColumns={Trading_Accounts_Close_Order}
          exportColumns={Export_Trading_Accounts_Close_Order}


        />
      </div>
    </Spin>
  )
}

export default CloseOrder