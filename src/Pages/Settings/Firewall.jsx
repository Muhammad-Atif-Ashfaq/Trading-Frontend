import { Space, theme } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import CustomTable from '../../components/CustomTable';
import { Divider, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import AdminIP from './AdminIP';
import BrandIP from './BannedIP';
import UserIP from './UserIP';
import Active_IP_List from './Active_IP_List';

const Firewall = () => {
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  // Define the items with paths
  const items = [
    {
      key: '1',
      label: 'Active IP List',
      component: <Active_IP_List />,
      path: '/firewall/active-ip-list',
    },
  ];

  // Get the initial active tab from the current path
  const getInitialActiveTab = () => {
    const currentPath = location.pathname;
    const currentItem = items.find(item => item.path === currentPath);
    return currentItem ? currentItem.key : '1';
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab);

  useEffect(() => {
    setActiveTab(getInitialActiveTab());
  }, [location.pathname]);

  const onChange = (event, key) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem && selectedItem.path) {
      setActiveTab(key);
      navigate(selectedItem.path);
    }
  };

  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex items-center gap-3'>
        <img
          src={ARROW_BACK_CDN}
          alt='back icon'
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <h1 className='text-2xl font-semibold'>Firewall IP Restrictions</h1>
      </div>

      <div className="mt-4">
        <Tabs
          value={activeTab}
          onChange={onChange}
          TabIndicatorProps={{ style: { backgroundColor: '#1CAC70' } }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '14px',
              mb: -2,
            },
            '& .Mui-selected': {
              color: '#1CAC70 !important',
            },
          }}
          aria-label="tabs example"
        >
          {items.map(item => (
            <Tab
              sx={{ fontSize: "14px", textTransform: "none", mb: -2, fontWeight: 'bold' }}
              label={item.label}
              key={item.key}
              value={item.key}
            />
          ))}
        </Tabs>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Firewall;
