import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, EyeOutlined, DeleteOutlined,CaretUpOutlined,CaretDownOutlined } from '@ant-design/icons';
import { Space, Spin, Tag, theme } from 'antd';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/CustomTextField';
import { Trading_Accounts_List, Delete_Trading_Account, Save_Trading_Account } from '../../utils/_TradingAPICalls';
import CustomModal from '../../components/CustomModal';
import { useSelector, useDispatch } from 'react-redux';
import TradingModal from './TradingModal'
import { setAccountID, setSelectedTradingAccountsIDs, setTradingAccountsData } from '../../store/TradeSlice';
import { Trading_Active_Group, Trading_Margin_Calls } from '../../utils/_SymbolSettingAPICalls';
import Swal from 'sweetalert2';
import CustomNotification from '../../components/CustomNotification';
import { CheckBrandPermission } from '../../utils/helpers';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'



const Index = ({ title, direction }) => {
  const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const [tradingAccountsList, setTradingAccountsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradingID, setTradingID] = useState(null);

  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchedColumn, setSearchedColumn] = useState('');
  const [perPage, setPerPage] = useState(10)



  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const setTradeId = (id) => {
    dispatch(setAccountID(id))
    
    navigate('/single-trading-accounts/details/live-order')

  }

  const renderColumns = [
    {
      title:<span className="dragHandler">LoginID</span>,
      dataIndex: 'loginId',
      key: '1',
      sorter: (a, b) => a.loginId.length - b.loginId.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 


    },
    {
      title:<span className="dragHandler">Trading Group Id</span>,
      dataIndex: 'trading_group_id',
      key: '1',
      sorter: (a, b) => a.trading_group_id.length - b.trading_group_id.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Brand</span>,
      dataIndex: 'brand',
      key: '1',
      sorter: (a, b) => a.brand.length - b.brand.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Country</span>,
      dataIndex: 'country',
      key: '1',
      sorter: (a, b) => a.country.length - b.country.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Phone No.</span>,
      dataIndex: 'phone',
      key: '1',
      sorter: (a, b) => a.phone.length - b.phone.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Email</span>,
      dataIndex: 'email',
      key: '1',
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '1',
      sorter: (a, b) => a.leverage.length - b.leverage.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Balance</span>,
      dataIndex: 'balance',
      key: '1',
      sorter: (a, b) => a.balance.length - b.balance.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Credit</span>,
      dataIndex: 'credit',
      key: '1',
      sorter: (a, b) => a.credit.length - b.credit.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Equity</span>,
      dataIndex: 'equity',
      key: '1',
      sorter: (a, b) => a.equity.length - b.equity.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {

      title:<span className="dragHandler">Margin Level</span>,
      dataIndex: 'margin_level_percentage',
      key: '1',
      sorter: (a, b) => a.margin_level_percentage.length - b.margin_level_percentage.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Profit</span>,
      dataIndex: 'profit',
      key: '1',
      sorter: (a, b) => a.profit.length - b.profit.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '1',
      sorter: (a, b) => a.swap.length - b.swap.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
     title:<span className="dragHandler">Currency</span>,
      dataIndex: 'currency',
      key: '1',
      sorter: (a, b) => a.currency.length - b.currency.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {

     title:<span className="dragHandler">Registration Time</span>,
      dataIndex: 'registration_time',
      key: '1',
      sorter: (a, b) => a.registration_time.length - b.registration_time.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Last Access Time</span>,
      dataIndex: 'last_access_time',
      key: '1',
      sorter: (a, b) => a.last_access_time.length - b.last_access_time.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title:<span className="dragHandler">Last Access IP</span>,
      dataIndex: 'last_access_address_IP',
      key: '1',
      sorter: (a, b) => a.last_access_address_IP.length - b.last_access_address_IP.length,
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      }, 
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: '9',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <EyeOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => setTradeId(record.id)} />
            <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => DeleteHandler(record.id)} />
        </Space>
      ),
    },
  ]

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };


  
 

  const fetchTradingAccounts = async (brandId,page) => {
    setIsLoading(true)
    const mData = await Trading_Accounts_List(token,brandId,page)
    const { data: { message, payload, success } } = mData
    setIsLoading(false)
    if (success) {
      const tradingAccounts = payload.data.map((item) => ({
        id: item.id,
        loginId: item.login_id,
        trading_group_id: item.trading_group_id,
        brand: item.brand.name,
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
        last_access_address_IP: item.last_access_address_IP ? item.last_access_address_IP : '...' ,

      }))
      setTradingAccountsList(tradingAccounts)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
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

 
    const DeleteHandler = async (id)=>{
  
      setIsLoading(true)
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1CAC70",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
          const res = await Delete_Trading_Account(id, token)
          const {data:{success, message, payload}} = res
          setIsLoading(false)
          if(success){
            Swal.fire({
              title: "Deleted!",
              text: message,
              icon: "success"
            });

        
       if( userRole === 'brand' ){
        switch(direction){
          case 1:
            fetchTradingAccounts(userBrand.public_key,CurrentPage);
            break;
          case 2:
             fetchActiveGroups(userBrand.public_key,CurrentPage);
            break;
          case 3: 
            fetchMarginCalls(userBrand.public_key,CurrentPage) 
            break;
        }
        } 
        else{
          switch(direction){
          case 1:
            fetchTradingAccounts(null,CurrentPage);
            break;
          case 2:
             fetchActiveGroups(null,CurrentPage);
            break;
          case 3: 
            fetchMarginCalls(null,CurrentPage) 
            break;
        }

        }
           
          }else{
            Swal.fire({
              title: "Opps!",
              text: {message},
              icon: "error"
            });
          }
        
        }
      });
    
  setIsLoading(false)
 
}

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])


const [marginCall, setMarginCall] = useState([])
const [activeGroup, setActiveGroup] = useState([])


  const fetchActiveGroups = async (brandId,page) => {
    try {
      setIsLoading(true)
      const res = await Trading_Active_Group(token, 'active',brandId,page);
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

      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };


  const fetchMarginCalls = async (brandId,page) => {
    
    try {
      setIsLoading(true)
      const res = await Trading_Margin_Calls(token, 'margin_call',brandId,page);
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
        last_access_address_IP: item.last_access_address_IP ? item.last_access_address_IP : '...' ,
      }))
      setIsLoading(false)
      setMarginCall(tradingAccounts);

      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };


  const onPageChange = (page) =>{
      if(userRole === 'brand' ){
      fetchTradingAccounts(userBrand.public_key,page)
    }
    else{
      fetchTradingAccounts(null,page)
    }
  }



  useEffect(() => {

  switch (direction) {
    case 1:
      if (userRole === 'brand') {
        fetchTradingAccounts(userBrand.public_key, CurrentPage);
      } else {
        fetchTradingAccounts(null, CurrentPage);
      }
      break;
    case 2:
      if (userRole === 'brand') {
        fetchActiveGroups(userBrand.public_key, CurrentPage);
      } else {
        fetchActiveGroups(null, CurrentPage);
      }
      break;
    case 3:
      if (userRole === 'brand') {
        fetchMarginCalls(userBrand.public_key, CurrentPage);
      } else {
        fetchMarginCalls(null, CurrentPage);
      }
  }
}, [direction]);


  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
       

        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>{title}</h1>
          <CustomTextField
            label='Search'
            sx={{ width: '300px' }}

          />
          
    
            
       {CheckBrandPermission(userPermissions,userRole,'trading_account_list_create') &&(<CustomButton
            Text='Add New Trading Account'
            style={{ height: '48px', }}
            icon={<PlusCircleOutlined />}
            onClickHandler={() => navigate('/trading-accounts-entry')}
          />)}

           
         
        </div>
        {direction === 1 && (
          <CustomTable
          direction="/trading-accounts"
          formName = "Trading Accounts" 
          columns={renderColumns}
          data={tradingAccountsList} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          isUpated={isUpdated}
          setSelecetdIDs={setSelectedTradingAccountsIDs}
          setTableData = {setTradingAccountsData}
          table_name= "trading_accounts"
          setSortDirection = {setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery = {Trading_Accounts_List}
          LoadingHandler={LoadingHandler}

        />
        )}
        {direction === 2 && (
        <CustomTable
          direction="/active-accounts"
          formName = "Active Accounts" 
          columns={renderColumns}
          data={activeGroup} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          editPermissionName="active_account_group_update"
          deletePermissionName="active_account_group_delete"
        />
       
       )}
        {direction === 3 && (
        <CustomTable
          direction="/margin-calls"
          formName = "Margin Calls" 
          columns={renderColumns}
          data={marginCall} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          editPermissionName="margin_call_trading_update"
          deletePermissionName="margin_call_trading_delete"
        />
        )}

        {/* <CustomModal
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
        </CustomModal> */}

          
        
      </div>
    </Spin>
  )
}

export default Index