import React, { useEffect, useState } from 'react'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Spin, theme } from 'antd';
import CustomTable from '../../../components/CustomTable';
import { GET_Min_Chart_Data } from '../../../utils/_TradeOrderAPI';
import { useSelector } from 'react-redux';
import ARROW_UP_DOWN from '../../../assets/images/arrow-up-down.png'
import  "../../DnDTable/index.css";
import '../SymbolSettings/index.css'
import moment from 'moment';

const columns = [
  {
    title: <span className="dragHandler">DateTime</span>,
    dataIndex: 'created_at',
    key: '1',
    sorter: (a, b) => a.created_at.length - b.created_at.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
  },
  {
    title: <span className="dragHandler">Open</span>,
    dataIndex: 'open',
    key: '2',
    sorter: (a, b) => a.open.length - b.open.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
  },
  {
    title: <span className="dragHandler">High</span>,
    dataIndex: 'high',
    key: '3',
    sorter: (a, b) => a.high.length - b.high.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
  },
  {
    title: <span className="dragHandler">Low</span>,
    dataIndex: 'low',
    key: '4',
    sorter: (a, b) => a.low.length - b.low.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
  },
  {
    title: <span className="dragHandler">Close</span>,
    dataIndex: 'close',
    key: '5',
    sorter: (a, b) => a.close.length - b.close.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
  },
  {
    title: <span className="dragHandler">Symbol</span>,
    dataIndex: 'name',
    key: '6',
    sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
  },
  
];
// const data = [
//   {
//     key: '1',
//     'DateTime': '2024-03-29 10:00:00',
//     'Open': 100,
//     'High': 105,
//     'Low': 102,
//     'Close': 1000,
//   },
//   {
//     key: '2',
//     'DateTime': '2024-03-29 10:05:00',
//     'Open': 102,
//     'High': 107,
//     'Low': 105,
//     'Close': 1200,
//   },
//   // Add more data objects as needed
// ];



const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)

  const [mindata, setMinData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');


  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)

  const getMinChartData = async (page) => {
    try {
      setIsLoading(true)
      // const res = await GET_Group_Transaction_Order(token, trading_group_id)
      const res = await GET_Min_Chart_Data(token, page, parseInt(perPage))
      const { data: { message, payload, success, } } = res
      setIsLoading(false)
      const minData = payload?.data.map((x)=> ({...x, created_at:moment(x.created_at).format('D MMMM YYYY h:mm A')})) 
      setMinData(minData)
      setTotalRecords(payload?.total)
      setCurrentPage(payload?.current_page)
      setLastPage(payload?.last_page)
      setIsUpdated(false)
    }
    catch (error) {
      console.error('Error fetching trade Min Chart Data:', error);
    }
  }
  
  const onPageChange = (page) => {
    getMinChartData(page)
  }

  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
    }, [checkedList]);
    
  useEffect(() => { 
    setIsUpdated(true)
    getMinChartData(CurrentPage)
   }, [perPage])

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])


  const { token: { colorBG, TableHeaderColor } } = theme.useToken();
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>1 Minute Charts</h1>
      </div>
      <Spin spinning={isLoading} size="large">
      {/* <CustomTable columns={columns} data={mindata} headerStyle={headerStyle} /> */}
      
       <CustomTable
          direction="/min-charts"
          formName = "1 Minute Charts" 
          columns={newColumns}
          data={mindata} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          isUpated={isUpdated}
        // setSelecetdIDs={setTradeGroupsSelectedIDs}
        // setTableData = {setTradeGroupsData}
          // table_name= "charts"
          setSortDirection = {setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery = {GET_Min_Chart_Data}
          LoadingHandler={LoadingHandler}
        />
        </Spin>
    </div>
  )
}
export default Index