import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./UserSlice";
import trade from "./TradeSlice";
import symbolSettings from "./symbolSettingsSlice";
import marginCalls from "./marginCallsSlice"
import activeAccount from "./activeAccountSlice"
import symbolGroups from "./symbolGroupsSlice"
import transactionOrders from './transactionOrdersSlice'
import tradeOrders  from './TradeOrders'
import storage from 'redux-persist/lib/storage'
import group from './TradingGroupData'
import brands from './BrandsSlice'
import tradeGroups from "./tradeGroupsSlice";
import tradingAccountGroup from "./tradingAccountGroupSlice";
import tradeWithdrawGroups from "./tradeGroupsWithdrawSlice";
import liveOrder from "./LiveOrderSlice";
import tradingAccount from "./TradingAccountListSlice";
import activityLogin from "./ActivityLoginSlice"
import ipAddress from "./IpAdressSlice";
import terminal from "./terminalSlice" 
import CSVData from "./CSVDataSlice"

const createRootReducer = asyncReducers => {
  const appReducer = combineReducers({
      user,
      group,
      trade,
      symbolSettings,
      marginCalls,
      activeAccount,
      symbolGroups,
      brands,
      liveOrder,
      transactionOrders,
      tradeOrders,
      tradeGroups,
      tradingAccountGroup,
      tradeWithdrawGroups,
      tradingAccount,
      activityLogin,
      ipAddress,
      terminal,
      CSVData,
      ...asyncReducers
  });
  
  return (state, action) => {
      if (action.type === 'user/userLoggedOut') {
          state = undefined;
          storage.removeItem('persist:root')
      }
      return appReducer(state, action);
  }

};

// const store = configureStore({
//     reducer:{
//       user: userReducer
//     }
// })

export default createRootReducer