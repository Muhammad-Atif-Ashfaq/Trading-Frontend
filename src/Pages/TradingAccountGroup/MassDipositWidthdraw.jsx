import React, { useEffect, useState } from 'react'

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Spin, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { GET_Group_Transaction_Order } from '../../utils/_TradeOrderAPI';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { setTradeWithdrawGroupsData, setTradeWithdrawGroupsSelectedIDs,setTradeWithdrawCurrentData } from '../../store/tradeGroupsWithdrawSlice';
import { ColumnSorter } from '../../utils/helpers';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'

const MassDipositWidthdraw = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const trading_group_id = useSelector((state) => state?.tradingAccountGroup?.selectedRowsIds ? state?.tradingAccountGroup?.selectedRowsIds[0] : 0)

  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const [transactionOrder, setTransactionOrder] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  // const getTransectionOrder = async () => {
  //   // try {
  //   //   setIsLoading(true)
  //   //   // const res = await GET_Group_Transaction_Order(token, trading_group_id)
  //   //   const res = await GET_Group_Transaction_Order(token, id)
  //   //   const { data: { message, payload, success, } } = res
  //   //   setIsLoading(false)
  //   //   setTransactionOrder(payload.data)
  //   //   setTotalRecords(payload.total)
  //   //   setCurrentPage(payload.current_page)
  //   //   setLastPage(payload.last_page)
  //   //   setIsUpdated(false)
  //   // }
  //   // catch (error) {
  //   //   console.error('Error fetching trade Mass Withdraw groups:', error);
  //   // }
  // }

  const onPageChange = () => {
    // getTransectionOrder()
  }

  // useEffect(() => { getTransectionOrder() }, [])

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const data = [
    {
      key: '1',
      Time: '10:00',
      Deal: 'Deal A',
      Type: 'Type A',
      Amount: '100',
    },
    {
      key: '2',
      Time: '11:00',
      Deal: 'Deal B',
      Type: 'Type B',
      Amount: '200',
    },
    // Add more data objects as needed
  ];


  const columns = [
    {
      title: <span className="dragHandler">Time</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
      sorter:(a, b) => ColumnSorter(a?.created_at , b?.created_at),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },

    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: '3',
      sorter:(a, b) => ColumnSorter(a?.type , b?.type),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Amount</span>,
      dataIndex: 'amount',
      key: '4',
      sorter:(a, b) => a?.amount - b?.amount,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Currency</span> ,
      dataIndex: 'currency',
      key: '5',
      sorter:(a, b) => ColumnSorter(a?.currency , b?.currency),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Method</span>,
      dataIndex: 'method',
      key: '6',
      sorter:(a, b) => ColumnSorter(a?.method , b?.method),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
  ];

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  const [SearchQueryList,SetSearchQueryList]= useState({})

  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);


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
              onClick={() => navigate('/trading-group')}
            />

            <h1 className='text-3xl font-bold'>Mass Deposit/Withdraw</h1>
          </div>
          <Link to={'/trading-group/mass-deposit/create'}>
            <CustomButton
              Text='Create New Mass Deposit / withdraw'
              style={{
                padding: '16px',
                height: '48px',
                borderRadius: '8px',

              }}
            />
          </Link>
        </div>
        <CustomTable
          direction="/trading-group/mass-deposit-entry"
          formName="Mass Deposit"
          columns={newColumns}
          column_name="group_unique_id"
          data={transactionOrder}
          headerStyle={headerStyle}
          total={totalRecords}
          setTotalRecords={setTotalRecords}
          onPageChange={onPageChange}
          current_page={CurrentPage}
          token={token}
          isUpated={isUpdated}
          setSelecetdIDs={setTradeWithdrawGroupsSelectedIDs}
          setTableData={setTradeWithdrawGroupsData}
          setCurrentData={setTradeWithdrawCurrentData}
          table_name="transaction_orders"
          setSortDirection={setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery={GET_Group_Transaction_Order}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
        />


         {/* direction="/transaction-orders-entry"
              formName = "Transactions Orders" 
              columns={newColumns}
              data={transactionData} 
              headerStyle={headerStyle}
              total={totalRecords}
              setTotalRecords={setTotalRecords}
              onPageChange = {onPageChange}
              current_page={CurrentPage}
              token = {token}
              isUpated={isUpdated}
              setSelecetdIDs={setTransactionsOrdersSelectedIDs}
              setTableData = {setTransactionOrdersData}
              table_name= "transaction_orders"
              setSortDirection = {setSortDirection}
              perPage={perPage}
              setPerPage={setPerPage}
              SearchQuery = {Search_Transaction_Ordcer}
              SearchQueryList={SearchQueryList}
              LoadingHandler={LoadingHandler}
              setCurrentPage={setCurrentPage}
              setLastPage={setLastPage} */}

      </div>
    </Spin>
  )
}

export default MassDipositWidthdraw