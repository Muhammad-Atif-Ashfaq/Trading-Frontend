import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import {  useNavigate } from 'react-router-dom';
import { Space, Spin, theme } from 'antd';
import { headerStyle } from '../MainLayout/style';
import { Search_Active_IP, addToBlack_List, getActiveIPs } from '../../utils/_IPAddress';
import { useSelector,useDispatch } from 'react-redux';
import { ColumnSorter } from '../../utils/helpers';
import { CaretUpOutlined, CaretDownOutlined,PlusCircleOutlined } from '@ant-design/icons';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import {  Box } from '@mui/material';
import CustomNotification from '../../components/CustomNotification';
import { setIPAddressSelectedIds, setIpAddressData } from '../../store/IpAdressSlice';
import CustomButton from '../../components/CustomButton';
const Active_IP_List = () => {
    const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const token = useSelector(({ user }) => user?.user?.token)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdated, setIsUpdated] = useState(true)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("")
  const [SearchQueryList,SetSearchQueryList]= useState({})

  const dispatch= useDispatch()
  const navigate = useNavigate()
  const getActiveIpData = async() => {
      try{
          setIsLoading(true)
          const res = await getActiveIPs(token)
          setIsLoading(false)
          setData(res.data.payload.data)
      }
      catch(errr){
          setIsLoading(false)
          console.log(errr)
      }

  }
  useEffect(() => {
    getActiveIpData()
    }, []);

    
      const columns = [
        
        {
          title: <span className="dragHandler">IP</span>,
          dataIndex: 'ip_address',
          key: '1',
          sorter: (a, b) =>  ColumnSorter(a.ip_address , b.ip_address),
          sortDirections: ['ascend', 'descend'],
          sortIcon: (sortDir) => {
            if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
            if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
            return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
          },
        },
        {
          title: <span className="dragHandler">Brand</span>,
          dataIndex: 'brand_name',
          key: '2',
          sorter: (a, b) =>  ColumnSorter(a.brand_name , b.brand_name),
          sortDirections: ['ascend', 'descend'],
          sortIcon: (sortDir) => {
            if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
            if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
            return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
          },
        },
        {
          title: <span className="dragHandler">Status</span>,
          dataIndex: 'status',
          key: '3',
          sorter: (a, b) =>  ColumnSorter(a.status , b.status),
          sortDirections: ['ascend', 'descend'],
          sortIcon: (sortDir) => {
            if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
            if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
            return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
          },
        },
        
      ];

    const [newColumns , setNewColumns] = useState(columns)
    const defaultCheckedList = columns.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);


      const LoadingHandler = React.useCallback((isLoading)=>{
        setIsLoading(isLoading)
      },[])
     

      const navigateToEntry = ()=>{
        navigate("/firewall/active-ip-list-entry")
        dispatch(setIPAddressSelectedIds([0]))
      }

  
   useEffect(() => {
        const newCols = columns.filter(x => checkedList.includes(x.key));
        setNewColumns(newCols)
        }, [checkedList]);

    
  return (
    <Spin spinning={isLoading} size="large">
      <Box sx={{display:'flex', justifyContent:'flex-end'}}>
   

        <CustomButton
            Text='Add IP'
            style={{ height: '48px', }}
            icon={<PlusCircleOutlined />}
            onClickHandler={navigateToEntry}
          />

      </Box>
      <div className='mt-4'>
          <CustomTable 
            direction="/firewall/active-ip-list-entry"
            formName = "Active Ips" 
            columns={newColumns} 
            data={data} 
            headerStyle={headerStyle}
            total={totalRecords}
            setTotalRecords={setTotalRecords}
            current_page={CurrentPage}
            token = {token}
            isUpated={isUpdated}
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {Search_Active_IP}
            SearchQueryList = {SearchQueryList}
            LoadingHandler={LoadingHandler}
            //onPageChange = {onPageChange}
            setCurrentPage={setCurrentPage}
            table_name="ip_list"
            setSelecetdIDs={setIPAddressSelectedIds}
            setTableData={setIpAddressData}
          />
    </div>
    </Spin>
  )
}

export default Active_IP_List
