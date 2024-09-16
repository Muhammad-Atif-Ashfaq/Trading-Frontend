import React,{useState} from 'react'
import {Grid,Tabs,Tab,Stack,Typography} from '@mui/material'
import EconomicCalender from './EconomicCalender';
import MarketNews from './MarketNews';
import Information from './Information';
import { useSelector } from 'react-redux';

const RightSideTabs = () => {
  
  const items = [
    {
      key: '1',
      label: 'Calender',
      component: <EconomicCalender />
    },
    {
      key: '2',
      label: 'Market News',
      component: <MarketNews/>,
    },
    {
      key: '3',
      label: 'Information',
      component: <Information />,
    },
  ];

  const [activeTab, setActiveTab] = useState('1');



  
  const onChange = (event, key) => {
  
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
          setActiveTab(key);
    }
  
  };

  return (
    <Grid container  rowGap={1} sx={{py:2,maxHeight:"calc(100vh - 80px)",overflowY:"auto", '&::-webkit-scrollbar': {
          display: 'none',
        },
          scrollbarWidth: 'none',
        
        }}> 
      
        <Grid item xs={12}>
            <Tabs
              value={activeTab}
              onChange={onChange}
              TabIndicatorProps={{ style: { backgroundColor: '#1CAC70' } }}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '12px',
                  mb: -2,
                  px:1
                },
                '& .Mui-selected': {
                  color: '#1CAC70 !important', // Ensure that the selected tab retains the custom color
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
          
        </Grid>
        
        <Grid item xs={12}>
          {items.find(item => item.key === activeTab)?.component}
        </Grid> 
    
    </Grid>
  )
}

export default RightSideTabs