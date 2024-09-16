import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../Pages/MainLayout/RootLayout';
import Dashboard from '../Pages/Dashboard';
import BrandList from '../Pages/Brand/BrandList';
import BrandSettings from '../Pages/BrandSettings';
import TradingAccount from '../Pages/TradingAccount';
import TradingAccountEntry from '../Pages/TradingAccount/TradingAccountEntry';
import SingleTradingAccount from '../Pages/SingleTradingAccount';
import TradingAccountDetails from '../Pages/TradingAccount/TradingAccountDetails';
import LiveOrders from '../Pages/LiveOrders/LiveOrders';
import CloseOrder from '../Pages/CloseOrder/CloseOrder';
import TransactionOrders from '../Pages/TransactionOrders/TransactionOrders';
import TransactionOrderEntry from '../Pages/TransactionOrders/TransactionOrderEntry';
import Reports from '../Pages/Reports';
import TradingAccountGroup from '../Pages/TradingAccountGroup';
import MBTradingOrder from '../Pages/TradingAccountGroup/MBTradingOrder';
import MassDipositWidthdraw from '../Pages/TradingAccountGroup/MassDipositWidthdraw';
import MDWEntry from '../Pages/TradingAccountGroup/MDWEntry';
import TradingGroupEntry from '../Pages/TradingAccountGroup/TradingGroupEntry';
import Trade from '../Pages/TradingAccount/Trade';
import LiveOrderEntry from '../Pages/TradingAccount/LiveOrderEntry';
import ActiveTradingAccount from '../Pages/TradingAccount/ActiveTradingAccount';
import SymbolGroup from '../Pages/Symbols/SymbolGroup';
import SymbolGroupEntry from '../Pages/Symbols/SymbolGroup/SymbolGroupEntry';
import SymbolSettings from '../Pages/Symbols/SymbolSettings';
import SymbolSettingsEntry from '../Pages/Symbols/SymbolSettings/SymbolSettingsEntry';
import DataFeed from '../Pages/Symbols/DataFeed';
import TicketCharts from '../Pages/Symbols/TicketCharts'
import MinChart from '../Pages/Symbols/MinChart'
import Settings from '../Pages/Settings'
import Firewall from '../Pages/Settings/Firewall'
import MarginCallsLevel from '../Pages/Settings/MarginCallsLevel'
import ChangePassword from '../Pages/Settings/ChangePassword'
import TradingViewChart from '../Pages/Brand/TradingViewChart';
import AuthLayout from '../Pages/Auth/AuthLayout';
import SignIn from '../Pages/Auth/SignIn';
import PersonalData from '../Pages/TradingAccount/PersonalData';
import Account from '../Pages/TradingAccount/Account';
import TransactionOrder from '../Pages/TradingAccount/TransactionOrder';
import EditLiveOrder from '../Pages/TradingAccount/EditLiveOrder';
import NewFeedData from '../Pages/Symbols/DataFeed/NewFeedData'
import BrandPermissions from '../Pages/BrandPermissions/BrandPermissions';
import TradingAccountsEntry from '../Pages/TradingAccount/TradingAccountsEntry';
import LiveOrdersEntery from '../Pages/LiveOrders/LiveOrdersEntery';
import CloseOrdersEntery from '../Pages/CloseOrder/CloseOrderEntery';
import PendingOrder from '../Pages/TradingAccount/PendingOrder';
import AllPendingOrder from '../Pages/PendingOrder/PendingOrder';
import BrandEntry from '../Pages/Brand/BrandEntry';
import PendingOrderEntry from '../Pages/PendingOrder/PendingOrderEntry';
import MarginCallEntry from '../Pages/TradingAccount/MarginCallEntry';
import TradingAccountLiveOrderEntry from '../Pages/TradingAccount/TradingAccountLiveOrderEntry';
import TradingAccountCloseOrderEntry from '../Pages/TradingAccount/TradingAccountCloseOrderEntry';
import TradingAccountPendingOrderEntry from '../Pages/TradingAccount/TradingAccountPendingOrderEntry';
import TradingAccountTransactionOrderEntry from '../Pages/TradingAccount/TradingAccountTransactionOrderEntry';
import MBTradingOrderEntry from '../Pages/TradingAccountGroup/MBTradingOrderEntry';
import MassDipositWidthdrawEntry from '../Pages/TradingAccountGroup/MassDipositWidthdrawEntry'
import ActivityLogin from '../Pages/ActivityLogin/ActivityLogin';
import ActivityLoginEntry from '../Pages/ActivityLogin/ActivityLoginEntry';
import TradingAccountActivityLogin from '../Pages/TradingAccount/ActivityLogin';
import TradingAccountActivityLoginEntry from '../Pages/TradingAccount/TradingAccountActivityLoginEntry';
import BrandActivityLogin from '../Pages/Brand/BrandActivityLogin';
import BrandActivityLoginEntry from '../Pages/Brand/BrandActivityLoginEntry'
import Active_IP_List from '../Pages/Settings/Active_IP_List';
import Active_IP_List_Entry from '../Pages/TradingAccount/Active_IP_List_Entry';
import CSVStepper from '../Pages/DnDTable/CSVStepper'
import TerminalDashboard, { Terminal,MarketNews,EconomicCalender,WatchMarket,Journal,ActiveOrders,OrderHistory,PendingOrders } from '../Pages/Terminal'

import ErrorPage from '../components/ErrorPage';
import RenderTerminal from '../Pages/NewTerminal'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "sign-in", element: <SignIn /> },
      { path: "/", element: <Navigate to="sign-in" replace /> }
    ],
  },
  {
    path: "/terminal/:brand_id",
    element: <Terminal/> // Pass brandId as prop
  },
 
   { path:"/" ,
   element:<TerminalDashboard  />,
    children: [
      { path: "terminal-market-watch/:brand_id", element: <WatchMarket /> },
      { path: "terminal-economic-calender/:brand_id", element: <EconomicCalender /> },
      { path: "terminal-market-news/:brand_id", element: <MarketNews /> },

]}, 

 {path:"/new-terminal/:domain/:brand_id",element:<RenderTerminal/>},

  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard-reports", element: <Reports /> },
      { path: "/brand", element: <BrandList /> },
      { path: "/brand-entry", element: <BrandEntry /> },
      { path: "/brand-permissions", element: <BrandPermissions /> },
      { path: "/brand-settings", element: <BrandSettings /> },
      { path: "/brand-login-activity", element:<BrandActivityLogin/>},
      {path:  "/brand-login-activity-entry", element:<BrandActivityLoginEntry/>},
      { path: "/trading-accounts", element: <TradingAccount direction={1} title="Trading Account List" /> },
      { path: "/trading-accounts/:id", element: <TradingAccountEntry /> },
      { path: "/trading-accounts-entry",element: <TradingAccountsEntry/>},
      { path: "/trading-group", element: <TradingAccountGroup /> },
      { path: "/trading-group-entry", element: <TradingGroupEntry /> },
      { path: "/trading-group/mb-to", element: <MBTradingOrder /> },
      { path: "/trading-group/mb-to-entry",element:<MBTradingOrderEntry/>},
      { path: "/trading-group/mb-to/create", element: <Trade trade_type="group" /> },
      { path: "/trading-group/mass-deposit", element: <MassDipositWidthdraw /> },
      { path: "/trading-group/mass-deposit/create", element: <MDWEntry /> },
      { path:  "/trading-group/mass-deposit-entry",element:<MassDipositWidthdrawEntry/>},
      { path: "/single-trading-accounts", element: <SingleTradingAccount /> },
      { path: "/single-trading-accounts/details/live-order-entry", element:<TradingAccountLiveOrderEntry/> },
      { path: "/single-trading-accounts/details/close-order-entry", element:<TradingAccountCloseOrderEntry/> },
      { path: "/single-trading-accounts/details/pending-order-entry", element:<TradingAccountPendingOrderEntry/> },
      { path :"/single-trading-accounts/details/transaction-order-entry", element:<TradingAccountTransactionOrderEntry/>},
      { path:"/single-trading-accounts/details/login-activity-entry",element:<TradingAccountActivityLoginEntry />},
      {
        path: "/single-trading-accounts/details", element: <TradingAccountDetails />, children: [
          { path: "live-order", element: <LiveOrders /> },
          { path: "symbol", element: <Trade /> },
          { path: "close-order", element: <CloseOrder /> },
          { path: "pending-order", element: <PendingOrder /> },
          { path: "personal-data", element: <PersonalData /> },
          { path: "account-security", element: <Account /> },
          { path: "transaction-order", element: <TransactionOrder /> },
          { path:"login-activity", element:<TradingAccountActivityLogin />},
       
        ]
      },
       {path:"/import-csv",element:<CSVStepper/>},
      
      { path:"/login-activity", element:<ActivityLogin />},
      { path:"/login-activity-entry",element:<ActivityLoginEntry />},
      { path: "/single-trading-accounts/details/live-order/:orderId", element: <EditLiveOrder /> },
      { path: "/live-orders", element: <LiveOrders /> },
      { path:"/live-orders-entry", element:<LiveOrdersEntery/>},
      { path: "/close-orders", element: <CloseOrder /> },
      { path:"/close-orders-entry",element:<CloseOrdersEntery/>},
      { path: "/pending-orders", element: <AllPendingOrder /> },
      { path: "/pending-orders-entry", element: <PendingOrderEntry /> },
      { path: "/transaction-orders", element: <TransactionOrders /> },
      { path: "/transaction-orders-entry", element: <TransactionOrderEntry /> },
      { path: "/active-accounts", element: <TradingAccount title={"Active Trading Account List"} direction={2} /> },
      { path: "/margin-calls", element: <TradingAccount direction={3} title="Margin Call Trading Account List" /> },
      { path: "/margin-calls-entry", element: <MarginCallEntry direction={3} title="Margin Call Trading Account List" /> },
      { path: "/symbol-groups", element: <SymbolGroup /> },
      { path: "/symbol-groups-entry", element: <SymbolGroupEntry /> },
      { path: "/symbol-settings", element: <SymbolSettings /> },
      { path: "/symbol-settings-entry", element: <SymbolSettingsEntry /> },
      { path: "/data-feed", element: <DataFeed /> },
      { path: "/data-feed/:id", element: <NewFeedData /> },
      { path: "/ticket-charts", element: <TicketCharts /> },
      { path: "/min-charts", element: <MinChart /> },
      { path: "/settings", element: <Settings /> },
      { path: "/firewall", element: <Firewall />, children:[
      {path:"active-ip-list",  element:<Active_IP_List/>},
            
      ]
    },
      { path:"/firewall/active-ip-list-entry", element:<Active_IP_List_Entry />},
      { path: "/margin-levels", element: <MarginCallsLevel /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/Chart", element: <TradingViewChart  /> },
      
    ],
  },
   {
    path: "*",
    element: <ErrorPage />,
   
  },
]);