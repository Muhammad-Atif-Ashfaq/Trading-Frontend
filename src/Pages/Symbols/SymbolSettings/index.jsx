import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, PlusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';

import { theme, Spin } from 'antd';
import ARROW_UP_DOWN from '../../../assets/images/arrow-up-down.png'
import FIND_IMAGE from '../../../assets/images/find.svg'
import CustomTable from '../../../components/CustomTable';
import CustomButton from '../../../components/CustomButton';
import { AddnewSettingsStyle } from '../../Brand/style';
import { useNavigate } from 'react-router-dom';
import { All_Setting_Data } from '../../../utils/_SymbolSettingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import "../../DnDTable/index.css";
import { setSymbolSettingsData, setSymbolSettingsSelecetdIDs } from '../../../store/symbolSettingsSlice';
import './index.css'
import { ColumnSorter } from '../../../utils/helpers';
import { Symbol_Setting } from '../../../utils/BackendColumns';
import { Export_Symbol_Setting } from '../../../utils/ExportColumns';

const Index = () => {
  const dispatch = useDispatch()

  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  const [allSetting, setAllSetting] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {

    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {

      title: <span className="dragHandler">Data Feed</span>,
      dataIndex: 'data_feed_name',
      key: '2',
      sorter: (a, b) => ColumnSorter(a.data_feed_name, b.data_feed_name),
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {

      title: <span className="dragHandler">Symbol Group</span>,
      dataIndex: 'group_name',
      key: '3',
      sorter: (a, b) => a.group_name.length - b.group_name.length,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Leverage</span>,
      dataIndex: 'leverage',
      key: '4',
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
      key: '5',
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
      key: '6',
      sorter: (a, b) => a.lot_size - b.lot_size,
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
      key: '7',
      sorter: (a, b) => a.lot_step - b.lot_step,
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
      key: '8',
      sorter: (a, b) => a.vol_min - b.vol_min,
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
      key: '9',
      sorter: (a, b) => a.vol_max - b.vol_max,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Pip</span>,
      dataIndex: 'pip',
      key: '10',
      sorter: (a, b) => a.pip - b.pip,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },

    },
    {
      title: <span className="dragHandler">Commission</span>,
      dataIndex: 'commission',
      key: '11',
      sorter: (a, b) => a.commission - b.commission,
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },
    {
      title: <span className="dragHandler">Enabled</span>,
      dataIndex: 'enabled',
      key: '12',
      sorter: (a, b) => ColumnSorter(a.enabled, b.enabled),
      // render:(text)=><span>{text ==1 ? "Yes" : "No"}</span>, 
      sortDirections: ['ascend', 'descend'],
      sortIcon: (sortDir) => {
        if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
        if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
        return <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
      },
    },

  ];
  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns, setNewColumns] = useState(columns)



  const fetchAllSetting = async (page) => {
    try {
      setIsLoading(true)
      const res = await All_Setting_Data(token, page, parseInt(perPage));
      const { data: { message, success, payload } } = res
      const transformedData = payload.data.map(item => ({
        ...item,
        enabled: item.enabled === "1" ? 'Yes' : 'No'
      }));
      // setSymbolSettingsData(payload.data)
      setIsLoading(false)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setAllSetting(transformedData);
      setTotalRecords(payload.total)
      setIsUpdated(false)
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  useEffect(() => {
    setIsUpdated(true)
    fetchAllSetting(CurrentPage)
  }, [perPage])

  const onPageChange = (page) => {
    fetchAllSetting(page)
  }
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
          <h1 className='text-2xl font-semibold'>Symbol Settings</h1>
          <div className='flex items-center gap-4'>
            <CustomButton
              Text='Add New Symbol Settings'
              style={AddnewSettingsStyle}
              icon={<PlusCircleOutlined />}
              onClickHandler={() => {
                dispatch(setSymbolSettingsSelecetdIDs([0]))
                navigate('/symbol-settings-entry')
              }}
            />
          </div>
        </div>

        <CustomTable
          direction="/symbol-settings-entry"
          formName="Symbol Settings"
          columns={newColumns}
          data={allSetting}
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange={onPageChange}
          current_page={CurrentPage}
          token={token}
          setTotalRecords={setTotalRecords}
          isUpated={isUpdated}
          setSelecetdIDs={setSymbolSettingsSelecetdIDs}
          setTableData={setSymbolSettingsData}
          table_name="symbel_settings"
          setSortDirection={setSortDirection}
          perPage={perPage}
          setPerPage={setPerPage}
          SearchQuery={All_Setting_Data}
          LoadingHandler={LoadingHandler}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
          backendColumns={Symbol_Setting}
          exportColumns={Export_Symbol_Setting}
        />
      </div>
    </Spin>
  )
}

export default Index