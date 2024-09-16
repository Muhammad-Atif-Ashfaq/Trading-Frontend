import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Spin, Tag, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/CustomTextField';
import pusher from '../../pusher';
import { Trading_Accounts_List, Delete_Trading_Account, Save_Trading_Account, Search_Trading_Accounts_List } from '../../utils/_TradingAPICalls';
import CustomModal from '../../components/CustomModal';
import { useSelector, useDispatch } from 'react-redux';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import TradingModal from './TradingModal'
import { setAccountID, setTradingAccountsData, setSelectedTradingAccountsIDs } from '../../store/TradeSlice';
import { Trading_Active_Group, Trading_Margin_Calls } from '../../utils/_SymbolSettingAPICalls';
import Swal from 'sweetalert2';
import { CheckBrandPermission, ColumnSorter, ColumnSpaceSorter } from '../../utils/helpers';
import CustomNotification from '../../components/CustomNotification';
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import { setMarginCallsData, setMarginCallsSelecetdIDs } from '../../store/marginCallsSlice';
import { setActiveAccountData, setActiveAccountSelecetdIDs } from '../../store/activeAccountSlice';
import { Trading_Accounts } from '../../utils/BackendColumns';
import { Export_Trading_Accounts } from '../../utils/ExportColumns';
import usePusher from '../../pusher/usePusher';


const Index = ({ title, direction }) => {
  const userPermissions = useSelector((state) => state?.user?.user?.user?.permissions)
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state) => state?.user?.user?.brand)
  const activeAccountFlag = useSelector(({activeAccount})=>activeAccount.activeFlag)
  const singleActiveAccount = useSelector(({activeAccount})=>activeAccount.singleActiveAccount)


  const [tradingAccountsList, setTradingAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradingID, setTradingID] = useState(null);

  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [refresh_data, setRefreshData] = useState(false)


  const [SearchQueryList, SetSearchQueryList] = useState({})

  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const tradingAccountUpdate = usePusher('trading_accounts','update')
  console.log('tradingAccount pusher===============',tradingAccountUpdate);
  


  const renderColumns = [
    {
      title: <span className="dragHandler">LoginID</span>,
      dataIndex: 'login_id',
      key: '1',
      sorter: (a, b) => ColumnSorter(a.login_id, b.login_id),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },

    },
    {
      title: <span className="dragHandler">Trading Group </span>,
      dataIndex: 'group_name',
      key: '2',
      sorter: (a, b) => ColumnSpaceSorter(a.group_name, b.group_name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },

    },
    {
      title: <span className="dragHandler">{userRole === 'admin' ? 'Brand' : 'Customer'}</span>,
      dataIndex: `${userRole === 'admin' ? 'brand_name' : 'brand_customer_name'}`,
      key: '3',
      sorter: (a, b) => (userRole === 'admin' ? ColumnSorter(a.brand_name, b.brand_name) : ColumnSorter(a.brand_customer_name, b.brand_customer_name)),
      // sorter: (a, b) => {userRole === 'admin' ? a.brand?.length - b.brand?.length : a.customer?.length - b.customer?.length},
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Country</span>,
      dataIndex: 'country',
      key: '4',
      sorter: (a, b) => ColumnSorter(a.country, b.country),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Phone No.</span>,
      dataIndex: 'phone',
      key: '5',
      sorter: (a, b) => a.phone - b.phone,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Email</span>,
      dataIndex: 'email',
      key: '6',
      sorter: (a, b) => ColumnSorter(a.email, b.email),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '7',
      sorter: (a, b) => {
        // Split the ratio values and parse them as numbers
        const ratioA = a.leverage.split(':').map(Number);
        const ratioB = b.leverage.split(':').map(Number);

        // Compare the ratio values
        if (ratioA[0] === ratioB[0]) {
          return ratioA[1] - ratioB[1];
        }
        return ratioA[0] - ratioB[0];
      },
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Balance</span>,
      dataIndex: 'balance',
      key: '8',
      sorter: (a, b) => a.balance - b.balance,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Credit</span>,
      dataIndex: 'credit',
      key: '9',
      sorter: (a, b) => a.credit - b.credit,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Equity</span>,
      dataIndex: 'equity',
      key: '10',
      sorter: (a, b) => a.equity - b.equity,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {

      title: <span className="dragHandler">Margin Level</span>,
      dataIndex: 'margin_level_percentage',
      key: '11',
      sorter: (a, b) => a.margin_level_percentage - b.margin_level_percentage,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '12',
      sorter: (a, b) => a.profit - b.profit,
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
      key: '13',
      sorter: (a, b) => a.swap - b.swap,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Currency</span>,
      dataIndex: 'currency',
      key: '14',
      // sorter:(a, b) =>  ColumnSorter(a.currency,b.currency),
      // sortDirections: ['ascend', 'descend'],
      // sortIcon: (sortDir) => {
      //   if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
      //   if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
      //   return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
      // },
    },
    {

      title: <span className="dragHandler">Registration Time</span>,
      dataIndex: 'registration_time',
      key: '15',
      sorter: (a, b) => ColumnSorter(a.registration_time, b.registration_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Last Access Time</span>,
      dataIndex: 'last_access_time',
      key: '16',
      sorter: (a, b) => ColumnSorter(a.last_access_time, b.last_access_time),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    {
      title: <span className="dragHandler">Last Access IP</span>,
      dataIndex: 'last_access_address_IP',
      key: '17',
      sorter: (a, b) => ColumnSorter(a.last_access_address_IP, b.last_access_address_IP),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;
      },
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'type',
    //   key: '18',
    //   render: (_, record) => {
    //     return (
    //     <Space size="middle" className='cursor-pointer'>
    //       <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() =>{ 
    //         setTradeId(record)

    //         // dispatch(setTradingAccountGroupData(record)) 
    //         }} />
    //         <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => DeleteHandler(record.id)} />
    //     </Space>
    //   )},
    // },
  ]

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };

  const setTradeId = (record) => {
    dispatch(setTradingAccountGroupData(record))
    dispatch(setAccountID(record.id))
    navigate('/single-trading-accounts/details/live-order')

  }

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])

  const fetchTradingAccounts = async (brandId, page) => {
    setIsLoading(true)
    const mData = await Trading_Accounts_List(token, brandId, page, parseInt(perPage))

    const { data: { message, payload, success } } = mData


    setIsLoading(false)
    if (success) {
      // const tradingAccounts = payload?.data?.map((item) => ({
      //   id: item.id,
      //   loginId: item.login_id,
      //   trading_group_id: item.trading_group_id,
      //   brand: item?.brand?.name,
      //   customer: item?.brand_customer,
      //   country: item?.country,
      //   phone: item?.phone,
      //   email: item?.email,
      //   leverage: item?.leverage,
      //   balance: item?.balance,
      //   credit: item?.credit,
      //   bonus: item?.bonus,
      //   commission: item?.commission,
      //   tax: item?.tax,
      //   equity: item?.equity,
      //   margin_level_percentage: item?.margin_level_percentage,
      //   profit: item?.profit,
      //   swap: item?.swap,
      //   currency: item?.currency,
      //   registration_time: item?.registration_time,
      //   last_access_time: item.last_access_time ? item.last_access_time : '...',
      //   last_access_address_IP: item?.last_access_address_IP ? item.last_access_address_IP : '...' ,
      //   brand_public_key: item?.brand?.public_key,
      //   brand_leverage: item?.brand?.leverage,
      //   brand_margin_call: item?.brand?.margin_call,

      // }))
      setTradingAccountsList(payload)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setIsUpdated(false)
    }
  }

  const showModal = (id = null) => {
    setTradingID(id)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const DeleteHandler = async (id) => {

    setIsLoading(true)
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
        const res = await Delete_Trading_Account(id, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if (success) {
          Swal.fire({
            title: "Deleted!",
            text: message,
            icon: "success"
          });


          //  if( userRole === 'brand' ){
          //   switch(direction){
          //     case 1:
          //       fetchTradingAccounts(userBrand.public_key,CurrentPage);
          //       break;
          //     case 2:
          //        fetchActiveGroups(userBrand.public_key,CurrentPage);
          //       break;
          //     case 3: 
          //       fetchMarginCalls(userBrand.public_key,CurrentPage) 
          //       break;
          //   }
          //   } 
          //   else{
          //     switch(direction){
          //     case 1:
          //       fetchTradingAccounts(null,CurrentPage);
          //       break;
          //     case 2:
          //        fetchActiveGroups(null,CurrentPage);
          //       break;
          //     case 3: 
          //       fetchMarginCalls(null,CurrentPage) 
          //       break;
          //   }

          // }

        } else {
          Swal.fire({
            title: "Opps!",
            text: { message },
            icon: "error"
          });
        }

      }
    });

    setIsLoading(false)

  }

  const [marginCall, setMarginCall] = useState([])
  const [activeGroup, setActiveGroup] = useState([])

  const defaultCheckedList = renderColumns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(renderColumns)

  const fetchActiveGroups = async (brandId, page) => {
    try {
      setIsLoading(true)
      const res = await Trading_Active_Group(token, 'active', brandId, page);
      const { data: { message, success, payload } } = res
      const tradingAccounts = payload?.data?.map((item) => ({

        id: item.id,
        loginId: item.login_id,
        trading_group_id: item.trading_group_id,
        country: item.country,
        phone: item.phone,
        email: item.email,
        leverage: item.leverage,
        balance: item.balance,
        credit: item.credit,
        equity: item.equity,
        margin_level_percentage: item.margin_level_percentage,
        profit: item.profit,
        swap: item.swap,
        currency: item.currency,
        registration_time: item.registration_time,
        last_access_time: item.last_access_time === null ? 'null' : item.last_access_time,
        last_access_address_IP: item.last_access_address_IP === null ? 'null' : item.last_access_address_IP,

      }))
      setIsLoading(false)
      setActiveGroup(tradingAccounts);
      setIsUpdated(false)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };


  const fetchMarginCalls = async (brandId, page) => {

    try {
      setIsLoading(true)
      const res = await Trading_Margin_Calls(token, 'margin_call', brandId, page);
      const { data: { message, success, payload } } = res

      const tradingAccounts = payload?.data?.map((item) => ({
        id: item.id,
        loginId: item.login_id,
        trading_group_id: item.trading_group_id,
        country: item.country,
        phone: item.phone,
        email: item.email,
        leverage: item.leverage,
        balance: item.balance,
        credit: item.credit,
        equity: item.equity,
        margin_level_percentage: item.margin_level_percentage,
        profit: item.profit,
        swap: item.swap,
        currency: item.currency,
        registration_time: item.registration_time,
        last_access_time: item.last_access_time ? item.last_access_time : '...',
        last_access_address_IP: item.last_access_address_IP ? item.last_access_address_IP : '...',
      }))
      setIsLoading(false)
      setMarginCall(tradingAccounts);
      setIsUpdated(false)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };


  const onPageChange = (page) => {
    if (userRole === 'brand') {
      fetchTradingAccounts(userBrand.public_key, page)
    }
    else {
      fetchTradingAccounts(null, page)
    }
  }

  useEffect(() => {
    const newCols = renderColumns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  useEffect(() => {
    setIsUpdated(true)
    if (userRole === 'brand') {
      SetSearchQueryList({ brand_id: userBrand.public_key, CurrentPage })
    } else {
      SetSearchQueryList({ CurrentPage,status:direction === 1 ? 'active':direction === 2 ? 'login': 'margin_call' })
    }

    const channel = pusher.subscribe('trading_accounts');
    channel.bind('update', (data) => {
      const mData = [data]
      // console.log('margin call pusher======',data)
      const isExist = !!marginCall.find(x => x.id === data.id);
      const tradingAccounts = mData?.map((item) => ({
        id: item.id,
        loginId: item.login_id,
        trading_group_id: item.trading_group_id,
        country: item.country,
        phone: item.phone,
        email: item.email,
        leverage: item.leverage,
        balance: item.balance,
        credit: item.credit,
        equity: item.equity,
        margin_level_percentage: item.margin_level_percentage,
        profit: item.profit,
        swap: item.swap,
        currency: item.currency,
        registration_time: item.registration_time,
        last_access_time: item.last_access_time ? item.last_access_time : '...',
        last_access_address_IP: item.last_access_address_IP ? item.last_access_address_IP : '...',
      }))

      if (data.status === 'margin_call'  && !isExist) {
        
        setMarginCall(tradingAccounts)
      }
      

    });

    return () => {
      channel.unbind('update');
      pusher.unsubscribe('trading_accounts');
    };
  }, [direction]);

  useEffect(()=>{
    setRefreshData(true)
},[
  tradingAccountUpdate
])


  // useEffect(() => {
  //   SetSearchQueryList({brand_id:userBrand.public_key,CurrentPage})
  // }, [pathname])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>


        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>{title}</h1>
          {/* <CustomTextField
            label='Search'
            sx={{ width: '300px' }}

          /> */}



          {(CheckBrandPermission(userPermissions, userRole, 'trading_account_list_create') && direction === 1) && (<CustomButton
            Text='Add New Trading Account'
            style={{ height: '48px', }}
            icon={<PlusCircleOutlined />}
            onClickHandler={() => setIsModalOpen(true)}
          />)}



        </div>
        {direction === 1 && (
          <div className='mb-6'>
            <CustomTable
              direction="/single-trading-accounts/details/live-order"
              formName="Trading Accounts"
              columns={newColumns}
              data={tradingAccountsList}
              headerStyle={headerStyle}
              total={totalRecords}
              onPageChange={onPageChange}
              current_page={CurrentPage}
              token={token}
              isUpated={isUpdated}
              setSelecetdIDs={setSelectedTradingAccountsIDs}
              setTableData={setTradingAccountGroupData}
              table_name="trading_accounts"
              setSortDirection={setSortDirection}
              setTotalRecords={setTotalRecords}
              perPage={parseInt(perPage)}
              setPerPage={setPerPage}
              SearchQuery={Search_Trading_Accounts_List}
              SearchQueryList={SearchQueryList}
              LoadingHandler={LoadingHandler}
              setCurrentPage={setCurrentPage}
              setLastPage={setLastPage}
              editPermissionName="trading_account_list_update"
              deletePermissionName="trading_account_list_delete"
              backendColumns={Trading_Accounts}
              exportColumns={Export_Trading_Accounts}
              setRefreshData={setRefreshData}
              
            />
          </div>
        )}
        {direction === 2 && (
          <CustomTable
            direction="/single-trading-accounts/details/live-order"
            formName="Active Accounts"
            columns={newColumns}
            // data={activeGroup}
            headerStyle={headerStyle}
            total={totalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            setSelecetdIDs={setSelectedTradingAccountsIDs}
            // setTableData={setActiveAccountData}
            editPermissionName="active_account_group_update"
            deletePermissionName="active_account_group_delete"
            table_name="trading_accounts"
            setSortDirection={setSortDirection}
            setTotalRecords={setTotalRecords}
            perPage={parseInt(perPage)}
            setPerPage={setPerPage}
            SearchQuery={Search_Trading_Accounts_List}
            SearchQueryList={SearchQueryList}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            backendColumns={Trading_Accounts}
            exportColumns={Export_Trading_Accounts}
            setRefreshData={setRefreshData}
            activeAccountFlag={activeAccountFlag}
            activeAccount={singleActiveAccount}
          />

        )}
        {direction === 3 && (
          <CustomTable
            direction="/single-trading-accounts/details/live-order"
            formName="Margin Calls"
            columns={newColumns}
            data={marginCall}
            headerStyle={headerStyle}
            total={totalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            setSelecetdIDs={setSelectedTradingAccountsIDs}
            setTableData={setMarginCallsData}
            editPermissionName="margin_call_trading_update"
            deletePermissionName="margin_call_trading_delete"
            table_name="trading_accounts"
            setSortDirection={setSortDirection}
            setTotalRecords={setTotalRecords}
            perPage={parseInt(perPage)}
            setPerPage={setPerPage}
            SearchQuery={Search_Trading_Accounts_List}
            SearchQueryList={SearchQueryList}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            backendColumns={Trading_Accounts}
            exportColumns={Export_Trading_Accounts}
            setRefreshData={setRefreshData}
          />
        )}

        <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <TradingModal
            setIsModalOpen={setIsModalOpen}
            fetchTradingAccounts={fetchTradingAccounts}
            BrandID={tradingID}
            page={CurrentPage}
          />
        </CustomModal>



      </div>
    </Spin>
  )
}

export default Index        