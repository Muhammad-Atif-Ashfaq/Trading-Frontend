// ya list h

import React, { useEffect, useState } from 'react'

import { Space, Spin, Tag, theme } from 'antd';

import { PlusCircleOutlined, EditOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import CustomButton from '../../components/CustomButton';
import { AddnewStyle, footerStyle, submitStyle } from '../Brand/style';
import CustomTable from '../../components/CustomTable';
import { Link, useNavigate } from 'react-router-dom';
import CustomModal from '../../components/CustomModal';
import TradingAccountModal from '../TradingAccountGroup/TradingAccountModal';
import { DeleteTradingAccountGroup, Search_Trading_Account_Group_List, Trading_Account_Group_List } from '../../utils/_TradingAccountGroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { CheckBrandPermission, ColumnSorter, CustomDeleteDeleteHandler } from '../../utils/helpers';
import { setTradingGroupData } from '../../store/TradingGroupData';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
// import { setTradeSettingsData, setTradeSettingsSelecetdIDs } from '../../store/tradeGroupsSlice';
import { setTradeGroupsData, setTradeGroupsSelectedIDs } from '../../store/tradeGroupsSlice'
import { setTradeWithdrawGroupsSelectedIDs } from '../../store/tradeGroupsWithdrawSlice';
import { All_TradingAccountList } from '../../utils/_TradingAPICalls';
import { Trading_Groups } from '../../utils/BackendColumns';
import { Export_Trading_Groups } from '../../utils/ExportColumns';



const Index = () => {
  const userPermissions = useSelector((state) => state?.user?.user?.user?.permissions)
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state) => state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const [TradingGroupID, setTradingGroupID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [TradingAccounGroupList, setTradingAccountGroupList] = useState([])
  const [selectedAccountData, setSelectedAccountData] = useState([])
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [SearchQueryList, SetSearchQueryList] = useState({})

  const columns = [
    {
      title: <span className="dragHandler">Group Name</span>,
      dataIndex: 'name',
      key: '1',
      sorter: (a, b) => ColumnSorter(a.name, b.name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: true,
    },
    {
      title: <span className="dragHandler">Brand Name</span>,
      dataIndex: 'brands_name',
      key: '2',
      sorter: (a, b) => ColumnSorter(a.brands_name, b.brands_name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: userRole === 'admin' ? true : false,

    },
    // {
    //   title:<span className="dragHandler">Brand Id</span>,
    //   dataIndex: 'brand_id',
    //   key: '3',
    //   sorter: (a, b) => a?.brand_id - b?.brand_id,
    //   sortDirections: ['ascend', 'descend'],
    //   sortIcon: (sortDir) => {
    //     if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
    //     if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
    //     return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
    //   },
    //   visible: true,

    // },
    {
      title: <span className="dragHandler">Symbol Group</span>,
      dataIndex: 'symbel_group',
      key: '4',
      // sorter:(a, b) =>  ColumnSorter(a.symbel_groups,b.symbel_groups),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      render: (_, { symbel_groups }) => (
        <>
          {symbel_groups?.map((tag) => {
            return (
              <Tag color={'green'} key={tag?.id}>
                {tag.name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      visible: true,

    },
    {
      title: <span className="dragHandler">Mass Laverage</span>,
      dataIndex: 'mass_leverage',
      key: '7',
      sorter: (a, b) => {
        // Split the ratio values and parse them as numbers
        const ratioA = a.mass_leverage.split(':').map(Number);
        const ratioB = b.mass_leverage.split(':').map(Number);

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
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: true,

    },
    {
      title: <span className="dragHandler">Mass Swap</span>,
      dataIndex: 'mass_swap',
      key: '8',
      sorter: (a, b) => a?.mass_swap - b?.mass_swap,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: true,

    },
    {
      title: <span className="dragHandler">Mass Buy/Sell Trading Order</span>,
      dataIndex: 'MBS',
      key: '5',
      render: (text, record) => <span onClick={() => {
        dispatch(setTradeGroupsSelectedIDs([record.id]))
        navigate('/trading-group/mb-to')
      }} style={{ color: colorPrimary, fontWeight: '600' }}>View Details</span>,
      // sorter:(a, b) =>  ColumnSorter(a.MBS,b.MBS),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: true,


    },
    {
      title: <span className="dragHandler">Mass deposit/widthdraw</span>,
      dataIndex: 'MDW',
      key: '6',
      render: (_, record) => (
        <span
          onClick={() => {
            dispatch(setTradeGroupsSelectedIDs([record.id]))
            navigate('/trading-group/mass-deposit')
          }}
          // to={`/trading-group/mass-deposit/${record.id}`}
          style={{ color: colorPrimary, fontWeight: '600' }}
        // onClick={() => handleMassDepositWithdrawClick(record.id, record.name)}
        >
          View Details
        </span>
      ),
      // sorter:(a, b) =>  ColumnSorter(a.MDW,b.MDW),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: true,

    },



    {
      title: <span className="dragHandler">Trading Accounts</span>,
      dataIndex: 'trading_accounts',
      key: '9',
      render: (text, record) => {
        const { trading_accounts } = record
        return (
          <span className='cursor-pointer' style={{ color: colorPrimary, fontWeight: '600' }} onClick={() => viewAccounts(record)}>View Accounts</span>
        )
      },
      // sorter:(a, b) =>  ColumnSorter(a.trading_accounts,b.trading_accounts),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
      visible: true,

    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle" className='cursor-pointer'>
    //       <EditOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => showModal(record.id)} />
    //       <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, DeleteTradingAccountGroup, setIsLoading)} />
    //     </Space>
    //   ),
    // },
  ];

  const filteredColumns = columns.filter((column) => column.visible !== false);
  //   const defaultCheckedList = columns.map((item) => item.key);
  // const [checkedList, setCheckedList] = useState(defaultCheckedList);
  // const [newColumns , setNewColumns] = useState(columns)

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(columns)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMassDepositWithdrawClick = (id, name) => {
    dispatch(setTradingGroupData({ id, name },));
  };


  const showAccountModal = (trading_accounts) => {
    setIsAccountModalOpen(true)
    if (trading_accounts?.length > 0) {
      setSelectedAccountData(trading_accounts)
    } else {
      setSelectedAccountData([]);
    }
  }
  const hideAccountModal = () => {
    setIsAccountModalOpen(false)
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const fetchData = async (brandId) => {
    setIsLoading(true)
    const res = await Trading_Account_Group_List(token, brandId)
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    if (success) {
      // const newData = payload.data.map((x)=>({
      //   name:x?.brands?.name,
      //   brands_name:x?.brands_name,
      //   brand_id:x?.brand_id,
      //   symbel_groups:x?.symbel_groups,
      //   MBS:x?.MBS,
      //   MDW:x?.MDW,
      //   mass_leverage:x?.mass_leverage,
      //   mass_swap:x?.mass_swap,
      //   trading_accounts:x?.trading_accounts,
      // }))
      setTradingAccountGroupList(payload?.data)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)
      setIsUpdated(false)
    }
  }

  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
  }, [checkedList]);

  useEffect(() => {
    setIsUpdated(true)
    if (userRole === 'brand') {
      SetSearchQueryList({ brand_id: userBrand.public_key })
    }
  }, [])


  const viewAccounts = async (record) => {
    const searchValues = {
      trading_group_id: record.id
    }
    try {
      const res = await All_TradingAccountList(token, searchValues);
      const { data: { message, success, payload } } = res
      showAccountModal(payload)
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }

  // useEffect(() => {
  //   const newCols = columns.filter(x => checkedList.includes(x.key));
  //   setNewColumns(newCols)
  //   }, [checkedList]);

  const onPageChange = () => {
    if (userRole === 'brand') {
      fetchData(userBrand?.public_key)
    }
    else {
      fetchData(null)
    }
  }
  useEffect(() => {
    onPageChange()
  }, [perPage])

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
        const res = await DeleteTradingAccountGroup(id, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if (success) {
          Swal.fire({
            title: "Deleted!",
            text: message,
            icon: "success"
          });
          fetchData()
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
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const LoadingHandler = React.useCallback((isLoading) => {
    setIsLoading(isLoading)
  }, [])

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Trading Account Group</h1>
          {CheckBrandPermission(userPermissions, userRole, 'trading_account_group_create') && <CustomButton
            Text='Add New Trading Group'
            style={{ height: '48px', ...AddnewStyle }}
            icon={<PlusCircleOutlined />}
            onClickHandler={() => {
              dispatch(setTradeGroupsSelectedIDs([0]))
              navigate('/trading-group-entry')
            }}
          />
          }
        </div>
        <CustomTable
          direction="/trading-group-entry"
          columns={filteredColumns}
          data={TradingAccounGroupList}
          headerStyle={headerStyle}
          formName={'Trading Account Group'}
          total={totalRecords}
          onPageChange={onPageChange}
          current_page={CurrentPage}
          token={token}
          setSelecetdIDs={setTradeGroupsSelectedIDs}
          setTableData={setTradeGroupsData}
          isUpated={isUpdated}
          editPermissionName="active_account_group_update"
          deletePermissionName="active_account_group_delete"
          setTotalRecords={setTotalRecords}
          table_name="trading_groups"
          setSortDirection={setSortDirection}
          perPage={parseInt(perPage)}
          setPerPage={setPerPage}
          SearchQuery={Search_Trading_Account_Group_List}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
          backendColumns={Trading_Groups}
          exportColumns={Export_Trading_Groups}
        />
        {/* <CustomModalp
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={[]}
        >
          <TradingAccountModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchData={fetchData}
            TradingGroupID={TradingGroupID}
          />
        </CustomModalp> */}
        <CustomModal
          isModalOpen={isAccountModalOpen}
          title={'Selected Accounts'}
          handleOk={handleOk}
          handleCancel={hideAccountModal}
          footer={[]}
          width={400}

        >
          {selectedAccountData.length > 0 ? selectedAccountData?.map((tag) => {
            return (
              <Tag color={'green'} key={tag.id}>
                {tag?.login_id}
              </Tag>
            );
          })
            : 'Thers no selected account'
          }
        </CustomModal>
      </div>
    </Spin>
  )
}

export default Index