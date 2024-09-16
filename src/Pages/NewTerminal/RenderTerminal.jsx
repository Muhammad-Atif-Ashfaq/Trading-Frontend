

import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {Grid } from '@mui/material';
import {useParams} from 'react-router-dom';
import TradingInformation from './molecules/TradingInformation';
import ErrorPage from '../../components/ErrorPage';
import WatchMarket from './molecules/WatchMarket';
import NewAppBar from './molecules/NewAppBar';
import RightSideTabs from './molecules/RightSideTabs'
import { useSelector } from 'react-redux';
import TerminalDashboard from './TerminalDashboard';
import Terminal from './molecules/Terminal';

function RenderTerminal() {


const {brand_id} = useParams()
 const token = useSelector(({ terminal }) => terminal?.user?.token)



  return (
    brand_id?(
        (token? <TerminalDashboard/> :
            <Terminal/>
        ) ):(
      <ErrorPage/>)
  );
}

RenderTerminal.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default RenderTerminal;
