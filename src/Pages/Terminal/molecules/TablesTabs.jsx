import React,{useState} from 'react'
import OrderHistory from './OrderHistory';
import ActiveOrders from './ActiveOrders';
import PendingOrders from './PendingOrders';
import Journal from './Journal';
import { Divider, Stack, Tab, Tabs,Typography } from '@mui/material';



const TablesTabs = () => {

    const [activeTab, setActiveTab] = useState('1');
  

    const onChange = (event, key) => {
        const selectedItem = items.find(item => item.key === key);
        if (selectedItem && selectedItem.path) {
          setActiveTab(key);
          navigate(selectedItem.path);
        }
      };

    const items = [
        {
          key: '1',
          label: 'Active Orders',
          component: <ActiveOrders/>,
          path: '/terminal/active-order',
        },
        {
          key: '2',
          label: 'Order History',
          component: <OrderHistory/>,
          path: '/terminal/order-history',
        },
        {
          key: '3',
          label: 'Pending Orders',
          component: <PendingOrders/>,
          path: "/terminal/pending-orders",
        },
        // {
        //   key: '4',
        //   label: 'Journal',
        //   component: <Journal/>,
        //   path: "/terminal/journal",
        // },
        
      
      ];
    

  return (
    <div>
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
            color: '#1CAC70 !important', // Ensure that the selected tab retains the custom color
          },
        }}
        aria-label="tabs example"
      >
        {items.map(item => (
         
          <Tab key={item.key} sx={{ fontSize: "14px", textTransform: "none", mb: -2, fontWeight:'bold' }} label={item.label}  value={item.key} /> 
        ))}
      </Tabs>
      <Divider sx={{mb:5}}/>
      {items.map(item => (
        item.key === activeTab ? <div key={item.key}>{item.component}</div> : null
      ))}

     

    </div>
  )
}

export default TablesTabs