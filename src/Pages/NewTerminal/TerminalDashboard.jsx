import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

import {Grid } from '@mui/material';
import TradingInformation from './molecules/TradingInformation';
import WatchMarket from './molecules/WatchMarket';
import NewAppBar from './molecules/NewAppBar';
import RightSideTabs from './molecules/RightSideTabs'

function TerminalDashboard() {




  return (
    <Box sx={{ display: 'flex',flexDirection:"column",overflowY:"hidden" }}>
     <NewAppBar/>
     <Grid container>

         
        <Grid item xs={3}>
           <WatchMarket/> 
        </Grid>
       
        <Grid item xs={6}>
           <TradingInformation/>
        </Grid>

         <Grid item xs={3}>
          <RightSideTabs/>
        </Grid>
        
      </Grid>
   
     
    
    </Box>
  );
}

TerminalDashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default TerminalDashboard;
