import React, { useState, useEffect } from 'react'
import { Space, theme, Spin, Table } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Delete_Trade_Order, Get_Trade_Order, Search_Pending_Order } from '../../utils/_TradingAPICalls';
import { ColumnSorter } from '../../utils/helpers';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png';
import { setPendingOrdersData, setPendingOrdersSelectedIds } from '../../store/TradingAccountListSlice';
import { MinusCircleOutlined } from '@ant-design/icons';
import { CurrenciesList } from '../../utils/constants';
import { Trading_Accounts_Pending_Order } from '../../utils/BackendColumns';
import { Export_Trading_Accounts_Pending_Order } from '../../utils/ExportColumns';
import usePusher from '../../pusher/usePusher';


const PendingOrder = ({ setManipulatedData, grandProfit, totalSwap }) => {


  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary }, } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [pendingOrder, setPendingOrder] = useState([])
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds[0])
  const { balance, currency, leverage, brand_margin_call, id, credit, bonus, commission, tax } = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData)
  const { title: CurrencyName } = CurrenciesList?.find(x => x.value === currency) || { label: 'Dollar ($)', value: '$', title: 'USD' }
  const [isUpdated, setIsUpdated] = useState(true)
  const [perPage, setPerPage] = useState(10)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [sortDirection, setSortDirection] = useState("")
  const [SearchQueryList, SetSearchQueryList] = useState({})

  const [refresh_data, setRefreshData] = useState(false)

  const tradeOrderUpdation = usePusher('trade_orders','update')

  const fetchPendingOrder = async (page) => {
    setIsLoading(true)
    const params = { trading_account_id, OrderTypes: ['pending'], token, page }
    const mData = await Get_Trade_Order(params)
    const { data: { message, payload, success } } = mData

    const orders = payload?.data?.map((order) => ({
      id: order.id,
      open_time: moment(order.open_time).format('MM/DD/YYYY HH:mm'),
      order_no: order.id,
      type: order.type,
      volume: order.volume,
      symbol: order.symbol,
      open_price: order.open_price,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      close_time: moment(order.close_time).format('MM/DD/YYYY HH:mm'),
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

      setPendingOrder(orders)
    }

  }


  const onPageChange = (page) => {
    fetchPendingOrder(page)
  }
  const columns = [
    {
      title: <span className="dragHandler">Symbol</span>,
      dataIndex: 'symbol_setting_name',
      key: '1',
      sorter: (a, b) => ColumnSorter(a.symbol_setting_name - b.symbol_setting_name),
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
      key: '3',
      sorter: (a, b) => ColumnSorter(a.type, b.type),
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
      key: '4',
      sorter: (a, b) => a.open_price - b.open_price,
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
      title: <span className="dragHandler">Take Profit</span>,
      dataIndex: 'takeProfit',
      key: '8',
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
      key: '6',
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
      key: '6',
      sorter: (a, b) => a.comment - b.comment,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    }
  ];

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(columns)



  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };



  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])


  useEffect(() => {

    SetSearchQueryList({ trading_account_id, order_types: ['pending'] })

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
          direction="/single-trading-accounts/details/pending-order-entry"
          formName="Trading Pending Orders"
          columns={newColumns}
          data={pendingOrder}
          headerStyle={headerStyle}
          total={totalRecords}
          setTotalRecords={setTotalRecords}
          onPageChange={onPageChange}
          current_page={CurrentPage}
          token={token}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row className='bg-gray-300'>
                <Table.Summary.Cell index={0} colSpan={10}>
                  <span className='text-sm font-bold text-arial'>
                    <MinusCircleOutlined />
                    Balance: {isNaN(balance) ? 0 : parseFloat(balance).toFixed(2)} {CurrencyName} &nbsp;
                    Credit: {isNaN(credit) ? 0 : parseFloat(credit).toFixed(2)} {CurrencyName} &nbsp;
                    Bonus: {isNaN(bonus) ? 0 : parseFloat(bonus).toFixed(2)} {CurrencyName} &nbsp;
                  </span>
                </Table.Summary.Cell>
                {/* <Table.Summary.Cell>{isNaN(totalSwap) ? 0 : totalSwap}</Table.Summary.Cell>
                  <Table.Summary.Cell>{isNaN(grandProfit) ? 0 : grandProfit}</Table.Summary.Cell> */}
              </Table.Summary.Row>
            </Table.Summary>
          )}
          refreshData={refresh_data}
          setRefreshData={setRefreshData}
          isUpated={isUpdated}
          setSelecetdIDs={setPendingOrdersSelectedIds}
          setTableData={setPendingOrdersData}
          table_name="trade_orders"
          setSortDirection={setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery={Search_Pending_Order}
          searchQueryManipulation={setManipulatedData}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
          editPermissionName="pending_orders_update"
          deletePermissionName="pending_orders_delete"
          backendColumns={Trading_Accounts_Pending_Order}
          exportColumns={Export_Trading_Accounts_Pending_Order}

        />
      </div>
    </Spin>
  )
}

export default PendingOrder