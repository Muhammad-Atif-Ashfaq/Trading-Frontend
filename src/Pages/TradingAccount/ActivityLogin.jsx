import { Space, Tag, theme, Spin } from 'antd';
import React, { useState, useEffect } from 'react'
import { CaretUpOutlined, CaretDownOutlined  } from '@ant-design/icons';
import CustomTable from '../../components/CustomTable';

import { useSelector } from 'react-redux';
import moment from 'moment'
import {  ColumnSorter, getCurrentIP } from "../../utils/helpers";
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import { TradingAccountLoginActivities } from '../../utils/_APICalls';
import { setLoginActivitySelectedRowsIds,setActivityLoginData } from '../../store/ActivityLoginSlice';
import { Export_Login_Activities } from '../../utils/ExportColumns';
import { Login_Activities } from '../../utils/BackendColumns';


const ActivityLogin = () => {


  const trading_account_id = useSelector((state)=> state?.trade?.selectedRowsIds[0])
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();

  const [current_ip, setCurrent_IP] = useState("")
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [SearchQueryList,SetSearchQueryList]= useState({})
 
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isUpdated, setIsUpdated] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [activitiesData,setActivitiesData] = useState([])

  
  const columns = [
    
    {
      title: <span className="dragHandler">Ip Address</span>,
      dataIndex: 'ip_address',
      key: '1',
      sorter: (a, b) => ColumnSorter(a.ip_address, b.ip_address),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Mac Address</span>,
      dataIndex: 'mac_address',
      key: '2',
      sorter: (a, b) => ColumnSorter(a.mac_address, b.mac_address),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Login Time</span>,
      dataIndex: 'login_time',
      key: '3',
      sorter: (a, b) => ColumnSorter(a.login_time, b.login_time),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Logout Time</span>,
      dataIndex: 'logout_time',
      key: '4',
      sorter: (a, b) => ColumnSorter(a.logout_time, b.logout_time),
       sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },  

  ];

    const fetchActivityLogins = async (page) => {
    setIsLoading(true)
      
    const mData = await TradingAccountLoginActivities(token,page)
    const { data: { message, payload, success } } = mData
    
    if (success) {
      setActivitiesData(payload?.data)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      
      setIsLoading(false)
      setIsUpdated(false)
    }
  }


  useEffect(() => {
    (async ()=> {
        // setIsLoading(true)
        // const ip = await getCurrentIP()
        // setCurrent_IP(ip.ip)
        // setIsLoading(false)

        SetSearchQueryList({
          trading_account_id
        })

    })()
  }, [])


    useEffect(() => {
    setIsUpdated(true)
    // fetchActivityLogins(CurrentPage)
  }, [perPage])

   const [newColumns , setNewColumns] = useState(columns)
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  

 
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };


 


  const clearFields = () => {
    
  }

  const onPageChange = (page) =>{
    // fetchActivityLogins(page)
  }



   useEffect(() => {
        const newCols = columns.filter(x => checkedList.includes(x.key));
        setNewColumns(newCols)
        }, [checkedList]);

  const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])



  const closeTransactionOrder = () => {
    setIsModalOpen(false)
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='rounded-lg' style={{ backgroundColor: colorBG }}>

        <h1 className='text-2xl font-bold'>Activity Login</h1>

        <div className="mb-4 grid grid-cols-1 gap-4 mt-4">

          <CustomTable
            direction="/single-trading-accounts/details/login-activity-entry"
            formName="Login Activities"
            columns={newColumns}
            data = {activitiesData}
            headerStyle={headerStyle}
            total={totalRecords}
            setTotalRecords={setTotalRecords}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            setSelecetdIDs={setLoginActivitySelectedRowsIds}
            setTableData = {setActivityLoginData}
            table_name= "trading_account_login_activities"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {TradingAccountLoginActivities}
            SearchQueryList={SearchQueryList}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            backendColumns={Login_Activities}
            exportColumns={Export_Login_Activities}
            // editPermissionName="transaction_orders_update"
            // deletePermissionName="transaction_orders_delete"
          />



        </div>

      </div>
    </Spin>
  )
}

export default ActivityLogin