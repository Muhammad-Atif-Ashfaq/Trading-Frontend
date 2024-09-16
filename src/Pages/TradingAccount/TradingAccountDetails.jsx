import React, { useEffect, useState } from 'react';
import { theme } from 'antd';
import LiveOrders from './LiveOrders';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import Trade from './Trade';
import CloseOrder from './CloseOrder';
import PersonalData from './PersonalData'; 
import Account from './Account';
import TransactionOrder from './TransactionOrder';
import { Get_Trade_Order } from '../../utils/_TradingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { CheckBrandPermission, calculateMargin, calculateNights, calculateNumOfPip, calculateProfitLoss, conditionalLeverage, getCurrentDateTime, getOpenPriceFromAPI } from "../../utils/helpers";
import { LeverageList } from '../../utils/constants';
import { setLiveOrdersData } from '../../store/LiveOrderSlice';
import PendingOrder from './PendingOrder';
import { Divider, Tab, Tabs } from '@mui/material';
import ActivityLogin from './ActivityLogin';
import { getOptions } from 'highcharts';

const TradingAccountDetails = () => {


  const dispatch = useDispatch();
  const [liveOrders, setLiveOrders] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [grandProfit, setGrandProfit] = useState(0);
  const [grandVolumn, setGrandVolumn] = useState(0); 
  const [grandMargin, setGrandMargin] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0)
  const [totalSwap, setTotalSwap] = useState(0);
  const token = useSelector(({user}) => user?.user?.token);
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name);
  const userPermissions = useSelector((state) => state?.user?.user?.user?.permissions);
  const { token: { colorBG } } = theme.useToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tradeId } = useParams();
  const [activeTab, setActiveTab] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const trading_account_id = useSelector((state) => state?.trade?.selectedRowsIds ? state?.trade?.selectedRowsIds[0]:0);
  const { leverage } = useSelector(({ tradingAccountGroup }) => tradingAccountGroup.tradingAccountGroupData);
  

   
//
  const setLiveManipulatedData = async (data) => {
      let totalProfit = 0;
      let totalVolumn = 0;
      let totalMargin = 0;
      let _totalSwap = 0;
      let t_commission = 0;
      const currentDateTime = getCurrentDateTime();
      const updatedData = await Promise.all(data.map(async (x) => {
        const { askPrice, bidPrice } = await getOpenPriceFromAPI(x?.symbol_setting, x.feed_name);
        
        const pipVal = x?.symbol_setting?.pip ? x?.symbol_setting?.pip : 5;
        const open_price = parseFloat(x?.open_price).toFixed(pipVal);
        const currentPrice = x.type === "sell" ? parseFloat(askPrice).toFixed(pipVal) ?? 0 : parseFloat(bidPrice).toFixed(pipVal) ?? 0;
        // const profit = parseFloat(calculateProfitLoss(currentPrice, parseFloat(x.open_price), x.type, parseFloat(x.volume), parseInt(pipVal))).toFixed(2);
        const profit =calculateProfitLoss(parseFloat(calculateNumOfPip(currentPrice, parseFloat(x?.open_price), x?.type, parseInt(pipVal))).toFixed(2), parseFloat(x?.volume));        
        totalProfit += parseFloat(profit);
        const res = (parseFloat(parseFloat(x.volume) * parseFloat(x?.symbol_setting?.lot_size) * x.open_price).toFixed(2));
        const margin = calculateMargin(res, conditionalLeverage(x?.trading_account,x?.symbol_setting));
        const totalNights = calculateNights(x.created_at, currentDateTime);
        const Calswap = parseFloat(x.volume) * totalNights * parseFloat(x.symbol_setting?.swap ?? 0);
        _totalSwap += parseFloat(Calswap ?? 0);
        const swap = Calswap > 0 ? -Calswap : Calswap;
        const comm = parseFloat(x?.commission ?? 0);
        t_commission += comm;
        totalMargin += parseFloat(margin);
        localStorage.setItem("margin", totalMargin)
        totalVolumn += parseFloat(res);
        return { ...x, swap, profit, currentPrice, open_price };
      }));
      
      setGrandProfit(totalProfit.toFixed(2));
      setGrandVolumn(totalVolumn.toFixed(2));
      setGrandMargin(totalMargin.toFixed(2));
      setTotalSwap(_totalSwap.toFixed(2));
      setTotalCommission(t_commission.toFixed(2));
    return updatedData;
  }
  const setCloseManipulatedData = (data) => {
    let totalProfit = 0;
    let _totalSwap = 0;
    let t_commission = 0;
    data.map((val)=> {
      totalProfit += parseFloat(val.profit);
      _totalSwap += parseFloat(val.swap);
      const comm = parseFloat(val?.commission ?? 0);
        t_commission += comm;
      return{...val, t_commission, _totalSwap }
    })
    setGrandProfit(totalProfit.toFixed(2));
    setTotalSwap(_totalSwap.toFixed(2));
    setTotalCommission(t_commission);
  return data;
}





  const items = [
    {
      key: '1',
      label: 'Live Orders',
      component: <LiveOrders
                            isLoading={isLoading} 
                            setIsLoading={setIsLoading}
                            CurrentPage={CurrentPage} 
                            lastPage={lastPage} 
                            totalRecords={totalRecords}
      />,
      path: '/single-trading-accounts/details/live-order',
      display: CheckBrandPermission(userPermissions, userRole, 'live_orders_read') ? 'show' : 'hide'
    },
    {
      key: '2',
      label: 'Trade',
      component: <Trade  CurrentPage={CurrentPage} trade_type="single" />,
      path: '/single-trading-accounts/details/symbol',
      display: CheckBrandPermission(userPermissions, userRole, 'live_orders_create') ? 'show' : 'hide'
    },
    {
      key: '3',
      label: 'Pending Order',
      component: <PendingOrder   grandProfit={grandProfit} margin={grandMargin} totalSwap={totalSwap} />,
      path: "/single-trading-accounts/details/pending-order",
      display: CheckBrandPermission(userPermissions, userRole, 'close_orders_read') ? 'show' : 'hide'
    },
    {
      key: '4',
      label: 'Close Order',
      component: <CloseOrder 
      setManipulatedData={setCloseManipulatedData} 
      grandProfit={grandProfit} 
      margin={grandMargin} 
      totalSwap={totalSwap}
      grandCommsion = {totalCommission}
      />,
      path: "/single-trading-accounts/details/close-order",
      display: CheckBrandPermission(userPermissions, userRole, 'close_orders_read') ? 'show' : 'hide'
    },
    {
      key: '5',
      label: 'Personal Data',
      component: <PersonalData />,
      path: "/single-trading-accounts/details/personal-data",
      display: 'show'
    },
    {
      key: '6',
      label: 'Account and Security',
      component: <Account />,
      path: "/single-trading-accounts/details/account-security",
      display: 'show'
    },
    {
      key: '7',
      label: 'Transaction Orders',
      component: <TransactionOrder />,
      path: "/single-trading-accounts/details/transaction-order",
      display: CheckBrandPermission(userPermissions, userRole, 'transaction_orders_read') ? 'show' : 'hide'
    },
    {
      key: '8',
      label: 'Login Activity',
      component: <ActivityLogin />,
      path: "/single-trading-accounts/details/login-activity",
      display: CheckBrandPermission(userPermissions, userRole, 'transaction_orders_read') ? 'show' : 'hide'
    },
  ];

  useEffect(() => {
    const activeTabItem = items.find(item => item.path === pathname);
    if (activeTabItem) {
      setActiveTab(activeTabItem.key);
    }
  }, [pathname, items]);

  const onChange = (event, key) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem && selectedItem.path) {
      setActiveTab(key);
      navigate(selectedItem.path);
    }
  };

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex gap-3'>
        <img 
          src={ARROW_BACK_CDN} 
          alt='back icon' 
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <h1 className='text-3xl font-bold'>Trading Account</h1>
      </div>

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
          item.display === 'show' ? 
          <Tab sx={{ fontSize: "14px", textTransform: "none", mb: -2, fontWeight:'bold' }} label={item.label} key={item.key} value={item.key} /> : 
          null
        ))}
      </Tabs>
      <Divider sx={{mb:5}}/>
      {items.map(item => (
        item.key === activeTab && item.display === 'show' ? <div key={item.key}>{item.component}</div> : null
      ))}
    </div>
  );
}

export default TradingAccountDetails;
