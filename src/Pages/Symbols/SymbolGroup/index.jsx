import React, { useEffect, useState } from 'react'
import { Spin, theme, Input } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ARROW_UP_DOWN from '../../../assets/images/arrow-up-down.png'
import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewStyle } from '../../Brand/style';
import CustomTextField from '../../../components/CustomTextField';
import { Symbol_Group_List, DeleteSymbolsGroup } from '../../../utils/_SymbolGroupAPI';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { setSymbolGroupsSelectedIDs, setSymbolGroupsData } from '../../../store/symbolGroupsSlice';
import { ColumnSorter } from '../../../utils/helpers';
import { Symbol_Group } from '../../../utils/BackendColumns';
import { Export_Symbol_Group } from '../../../utils/ExportColumns';

const Index = () => {
  const dispatch = useDispatch()
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const token = useSelector(({ user }) => user?.user?.token)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [SymbolList, setSymbolList] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
 
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const columns = [
    {
      title: <span className="dragHandler">Name</span>,
      dataIndex: 'name',
      key: '1',
      sorter: (a, b) => ColumnSorter(a.name, b.name),
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
      key: '2',
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
        return <img src={ARROW_UP_DOWN} width={12} height={12} />;  // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Swap</span>,
      dataIndex: 'swap',
      key: '3',
      sorter: (a, b) => a?.swap - b?.swap,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Lot Size</span>,
      dataIndex: 'lot_size',
      key: '4',
      sorter: (a, b) => a?.lot_size - b?.lot_size,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Lot Steps</span>,
      dataIndex: 'lot_step',
      key: '5',
      sorter: (a, b) => a?.lot_step - b?.lot_step,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Minimum Value</span>,
      dataIndex: 'vol_min',
      key: '6',
      sorter: (a, b) => a?.vol_min - b?.vol_min,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Maximum Value</span>,
      dataIndex: 'vol_max',
      key: '7',
      sorter: (a, b) => a?.vol_max - b?.vol_max,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    // {
    //   title:<span className="dragHandler">Start Time</span>,
    //   dataIndex: 'trading_interval_start_time',
    //   key: '8',
    //   sorter: (a, b) => a?.trading_interval_start_time?.length - b?.trading_interval_start_time?.length,
    //   sortDirections: ['ascend', 'descend'],
    //   sortIcon: (sortDir) => {
    //     if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
    //     if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
    //     return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
    //   },
    // },
    // {
    //   title:<span className="dragHandler">End Time</span>,
    //   dataIndex: 'trading_interval_end_time',
    //   key: '9',
    //   sorter: (a, b) => a?.trading_interval_end_time?.length - b?.trading_interval_end_time?.length,
    //   sortDirections: ['ascend', 'descend'],
    //   sortIcon: (sortDir) => {
    //     if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
    //     if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
    //     return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
    //   },
    // },
    // {
    //   title:<span className="dragHandler">Symbol Group TI</span>,
    //   dataIndex: 'trading_interval',
    //   key: '10',
    //   sorter: (a, b) => a.trading_interval.length - b.trading_interval.length,
    //   sortDirections: ['ascend', 'descend'],
    //   sortIcon: (sortDir) => {
    //     if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
    //     if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
    //     return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
    //   },
    // },
    // {
    //   title:<span className="dragHandler">Symbols</span>,
    //   render: (text)=> <Link to={'#'} className='text-sm font-semibold cursor-pointer' style={{color: colorPrimary }}>View Details</Link>,
    //   key: '11',
    //   sortDirections: ['ascend', 'descend'],
    //   sortIcon: (sortDir) => {
    //     if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
    //     if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
    //     return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
    //   },

    // },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //      <Link to={`/symbol-groups/${record.id}`}><EditOutlined style={{fontSize:"24px", color: colorPrimary }}  /></Link> 
    //        <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} onClick={()=> DeleteHandler(record.id)} />
    //     </Space>
    //   ),
    // },
  ];

  const [newColumns, setNewColumns] = useState(columns)
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);



  const FetchData = async (page) => {
    setIsLoading(true)
    const res = await Symbol_Group_List(token, page, parseInt(perPage))
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    if (success) {
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setSymbolList(payload.data)
      setIsUpdated(false)
    }
  }
  // const DeleteHandler = async (id)=>{
  //   setIsLoading(true)
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#1CAC70",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then(async(result) => {
  //     if (result.isConfirmed) {
  //       const res = await DeleteSymbolsGroup(id, token)
  //       const {data:{success, message, payload}} = res
  //       setIsLoading(false)
  //       if(success){
  //         Swal.fire({
  //           title: "Deleted!",
  //           text: message,
  //           icon: "success"
  //         });
  //         // FetchData(page)
  //       }else{
  //         Swal.fire({
  //           title: "Opps!",
  //           text: {message},
  //           icon: "error"
  //         });
  //       }

  //     }
  //   });

  //   setIsLoading(false)

  // }

  const onPageChange = (page) => {
    FetchData(page)
  }

  useEffect(() => {
    setIsUpdated(true)
    FetchData(CurrentPage)
  }, [perPage])


  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Symbol Group</h1>
          <div className='flex items-center gap-4'>
            <CustomButton
              Text='Add New Symbol Group'
              style={AddnewStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() => {
                dispatch(setSymbolGroupsSelectedIDs([0]))
                navigate('/symbol-groups-entry')
              }}
            />

          </div>
        </div>

        <div className='mb-5'>
          {/* #reigon Custom Table*/}
          <CustomTable
            direction="/symbol-groups-entry"
            formName="Symbol Groups"
            columns={newColumns}
            data={SymbolList}
            headerStyle={headerStyle}
            total={totalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            setTotalRecords={setTotalRecords}
            isUpated={isUpdated}
            setSelecetdIDs={setSymbolGroupsSelectedIDs}
            setTableData={setSymbolGroupsData}
            table_name="symbel_groups"
            setSortDirection={setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery={Symbol_Group_List}
            LoadingHandler={LoadingHandler}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
            backendColumns={Symbol_Group}
            exportColumns={Export_Symbol_Group}
          />
        </div>

      </div>
    </Spin>
  )
}

export default Index