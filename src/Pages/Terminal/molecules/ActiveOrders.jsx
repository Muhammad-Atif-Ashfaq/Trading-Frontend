import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { Put_Trading_Account, Search_Live_Order } from '../../../utils/_TradingAPICalls';
import { useSelector,useDispatch } from 'react-redux';
import { theme,Space } from 'antd';
import { CloseOutlined,EditOutlined,DeleteOutlined } from '@mui/icons-material';
import { MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import CustomNotification from '../../../components/CustomNotification';
import Swal from 'sweetalert2';
import { GenericDelete, UpdateMultiTradeOrder } from '../../../utils/_APICalls';
import { calculateEquity, calculateFreeMargin, calculateMargin, calculateMarginCallPer, calculateNights, calculateNumOfPip, calculateProfitLoss, checkNaN, conditionalLeverage, getCurrentDateTime, getOpenPriceFromAPI, getValidationMsg } from '../../../utils/helpers';
import CustomModal from '../../../components/CustomModal';
import EditActiveOrders from './EditActiveOrders';
import BinanceBidAsk from '../../../websockets/BinanceBidAsk';
import axios from 'axios';
import { setActiveEquity,setActiveProfit,setActiveFreeMargin } from '../../../store/terminalSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
    fontSize:"12px",
    fontWeight:500,
    width: 200
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '12px',
    width: 200,
  },
  
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
 
  // hide last border
  'td, th': {
    padding:0
  },
   '&:last-child td, &:last-child th': {
    backgroundColor: theme.palette.action.hover,
  },

}));







export default function ActiveOrders() {


    const [rows,setRows] = React.useState([])
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const token = useSelector(({ terminal }) => terminal?.user?.token)
    const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)

    const user = useSelector((state)=>state?.terminal?.user?.trading_account)
    const dispatch = useDispatch()
    const { token: { colorPrimary }} = theme.useToken();
    const [activeOrder,setActiveOrder] = React.useState(null);
    const grandProfit =  useSelector(({terminal})=>terminal?.active_profit);
    const [grandVolumn, setGrandVolumn] = React.useState(0.00); 
    const [grandMargin, setGrandMargin] = React.useState(0.00);
    const [totalCommission, setTotalCommission] = React.useState(0.00)
    const [totalSwap, setTotalSwap] = React.useState(0.00);

    const equity_g = useSelector(({terminal})=>terminal?.active_equity)
    const [margin_level,set_margin_level] = React.useState(0.00)
    const free_margin = useSelector(({terminal})=>terminal?.active_free_margin)

    const [pricing, setPricing] = React.useState({});
    let margin;

    const fetchBinanceData = async (order, pip) => {
    try {
      const endPoint= `${import.meta.env.VITE_BINANCE_API}?symbol=${order?.symbol_setting?.feed_fetch_name}`
      const response = await axios.get(endPoint);
      const data = response?.data;
       
        setPricing((prev) => ({
          ...prev,
          [order?.id]: {
            bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
            askPrice: parseFloat(data?.askPrice).toFixed(pip)
          }
        }));
        return data;
      
     
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFcsapiData = async (order, key, pip) => {
    
    try {
     
      const endPoint1= `${import.meta.env.VITE_FSCI_API}${key}/latest?symbol=${order?.symbol_setting?.feed_fetch_name}&access_key=${order?.symbol_setting?.data_feed?.feed_login}`

      
        const response = await axios.get(endPoint1);
        const data = response?.data;


        setPricing((prev) => ({
          ...prev,
          [order?.id]: {
            bidPrice: parseFloat(data?.response[0]?.o).toFixed(pip),
            askPrice: parseFloat(data?.response[0]?.c).toFixed(pip)
          }
        }));
     
    } catch (error) {
      // setError('Error fetching data');
      console.error(error);
    }
  };

   const fetchDataForSymbol = async (order, pip) => {


    const onError = (error) => {
        console.error('WebSocket error:', error);
      };
  
      const onClose = () => {
        console.log('Previous WebSocket connection closed');
      };

      const binanceStream = BinanceBidAsk(order?.symbol_setting, true);
      if (binanceStream) {
        
        const onDataReceived = (data) => {
          try{
              if(!data?.bidPrice){
                if(order?.symbol_setting?.feed_name === 'binance'){
                  fetchBinanceData(order, pip)
                }
                else{
                fetchFcsapiData(order, order?.symbol_setting?.feed_fetch_key, pip)
    
                }
              }
              else {
            
              setPricing((prev) => ({
                ...prev,
                [order?.id]: {
                  bidPrice: parseFloat(data?.bidPrice).toFixed(pip),
                askPrice: parseFloat(data?.askPrice).toFixed(pip)
                }
              }));
      
              }
          } catch (error) {
            console.error("Error in onDataReceived:", error);  
           }
        };
  
        binanceStream.start(onDataReceived, onError, onClose);
        // Optionally, stop the WebSocket connection when it's no longer needed  
        // binanceStream.stop();
      };
    

    };
// console.log(pricing);

  const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setLiveManipulatedData = async (data) => {
    
      let totalProfit = 0.00;
      let totalVolumn = 0.00;
      let totalMargin = 0.00;
       let _totalSwap = 0.00;
      let t_commission = 0.00;
    
    const currentDateTime = getCurrentDateTime();
    const updatedData = await Promise.all(data?.map(async (x) => { 
        // const  { askPrice, bidPrice } = await getOpenPriceFromAPI(x?.symbol, x?.feed_name);
        const pipVal = x?.symbol_setting?.pip ? x?.symbol_setting?.pip : 5;
        if(!pricing?.[x?.id]?.askPrice){
          await fetchDataForSymbol(x,pipVal)
        }
        const res = (parseFloat(parseFloat(x?.volume) * parseFloat(x?.symbol_setting?.lot_size) * x?.open_price).toFixed(2));
        margin = calculateMargin(res, conditionalLeverage(x?.trading_account,x?.symbol_setting));
        const open_price = parseFloat(x?.open_price).toFixed(pipVal);
        const currentPrice = x?.type === "sell" ? parseFloat(pricing?.[x?.id]?.askPrice).toFixed(pipVal) ?? 0 : parseFloat(pricing?.[x?.id]?.bidPrice).toFixed(pipVal) ?? 0;
        const profit = calculateProfitLoss(parseFloat(calculateNumOfPip(currentPrice, parseFloat(x?.open_price), x?.type, parseInt(pipVal))).toFixed(2), parseFloat(x?.volume));
        totalProfit += parseFloat(profit);
        const totalNights = calculateNights(x?.created_at, currentDateTime);
        const Calswap = parseFloat(x?.volume) * totalNights * parseFloat(x?.symbol_setting?.swap ?? 0.00);
        _totalSwap += parseFloat(Calswap ?? 0.00);
        const swap = Calswap > 0 ? -Calswap : Calswap;
        const comm = parseFloat(x?.commission ?? 0.00);
        t_commission += comm;
        totalMargin += parseFloat(margin);
        totalVolumn += parseFloat(res);
        
        return { ...x, swap, profit, currentPrice, open_price };
        
      }));
      
      set_margin_level(calculateMarginCallPer(user?.equity, margin))
      dispatch(setActiveEquity(calculateEquity(user?.balance, grandProfit, user?.credit, user?.bonus)))
      dispatch(setActiveFreeMargin(calculateFreeMargin(equity_g, margin)))
      setGrandVolumn(totalVolumn.toFixed(2));
      setGrandMargin(totalMargin.toFixed(2));
      dispatch(setActiveProfit(totalProfit.toFixed(2)))
      setTotalSwap(_totalSwap.toFixed(2));
      setTotalCommission(t_commission.toFixed(2));
      setRows(updatedData)
      return updatedData;
    
  }


  
  const fetchActiveOrders = async()=>{
    if(rows?.length){
      setLiveManipulatedData(rows)
    }else{
      const res = await Search_Live_Order(token,1,10,{trading_account_id,order_types:['market']})
      setLiveManipulatedData(res?.data?.payload?.data)
    }
    

  }

  const closeHandler = async (record) => {
    const modifiedData =[{
      ...record,
      trading_account_id,
      order_type: 'close',
      close_price:record.currentPrice,
      close_time:moment().format('D MMMM YYYY h:mm A')
    }]
  
  const Params  = {orders:modifiedData}
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Close it!"
  }).then(async(result)=> {
    if (result.isConfirmed) {
      const res = await UpdateMultiTradeOrder(Params,token)
      const { data: { success, message, payload } } = res
      if (success) {
        CustomNotification({
          type: "success",
          title: "Order Closed",
          description: message,
          key: "a4",
        })
        fetchActiveOrders()
      } else {
        CustomNotification({
          type: "error",
          title: "Oppssss..",
          description: message,
          key: "b4",
        })
      }

    }
  })
}

  const editHandler = (order)=>{
    setActiveOrder(order)
    setIsModalOpen(true)
  }

 
  React.useEffect(()=>{
  fetchActiveOrders()
},[pricing])

React.useEffect(() => {
  const intervalId = setInterval(async () => {
    try {
      if (rows?.length > 0) {
        

        const account_params = {
          margin_level_percentage: checkNaN(margin_level),
          equity: checkNaN(equity_g),
          commission: checkNaN(totalCommission),
          profit: checkNaN(grandProfit),
          swap: checkNaN(totalSwap),
          free_margin: checkNaN(free_margin),
          ...(margin_level < user?.brand?.margin_call && { status: "margin_call" })
        }
        const account_res = await Put_Trading_Account(id, account_params, token)


        const modifiedData = rows?.map(item => {
          return {
            ...item,
            order_type: ''
          };
        });
        const orders_params = { orders: modifiedData }
        const orders_res = await UpdateMultiTradeOrder(orders_params, token);
      }

    } catch (error) {
      console.error('Error calling API:', error);
    }
  }, 30000); // Interval set to 1000ms (1 second)
  // Clean up the interval on component unmount
  return () => clearInterval(intervalId);
}, []);



  return (
    <>
    <TableContainer component={Paper} sx={{overflowX:"auto"}}>
      <Table sx={{ minWidth: 2000 }} aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center">Symbol</StyledTableCell>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Volume</StyledTableCell>
            <StyledTableCell align="center">Open Time</StyledTableCell>
            <StyledTableCell align="center">Open Price</StyledTableCell>
             <StyledTableCell align="center">Current Price</StyledTableCell>
            <StyledTableCell align="center">SL</StyledTableCell>
            <StyledTableCell align="center">TP</StyledTableCell>
            <StyledTableCell align="center">Comment</StyledTableCell>
            <StyledTableCell align="center">Commission</StyledTableCell>
            <StyledTableCell align="center">Swap</StyledTableCell>
            <StyledTableCell align="center">Profit</StyledTableCell>
            <StyledTableCell align="left" colSpan={2}>Actions</StyledTableCell>

            
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell align="center">
                {row.symbol}
              </StyledTableCell>
              <StyledTableCell align="center">{row.id}</StyledTableCell>
              <TableCell sx={{color:"#0ECB81"}} align="center">{row.type}</TableCell>
              <StyledTableCell align="center">{row.volume}</StyledTableCell>
              <StyledTableCell align="center">{moment(row.open_time).format('D MMMM YYYY h:mm A')}</StyledTableCell>
              <StyledTableCell align="center">{row.open_price}</StyledTableCell>
              <StyledTableCell align="center">{row.currentPrice}</StyledTableCell>
              <StyledTableCell align="center">{row.stopLoss}</StyledTableCell>
              <StyledTableCell align="center">{row.takeProfit}</StyledTableCell>
              <StyledTableCell align="center">{row.comment}</StyledTableCell>
              <StyledTableCell align="center">{row.commission}</StyledTableCell>
              <StyledTableCell align="center">{row.swap}</StyledTableCell>
              <StyledTableCell align="center">{row.profit}</StyledTableCell>

              <TableCell align="center" colSpan={2}>
                <Space size="middle" className='cursor-pointer'>
                  <CloseOutlined style={{ fontSize: "24px", color: colorPrimary }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeHandler(row);
                  }}
                  />
                  <EditOutlined 
                   style={{fontSize:"20px", color: colorPrimary }}
                   onClick={(e)=>{
                    e.stopPropagation();
                    editHandler(row)
                   }}
                   />
                 
                </Space >
               
              </TableCell>
            </StyledTableRow>
                        ))}
              <StyledTableRow>
                  <TableCell colSpan={10}>
                      <span className='text-xs font-bold text-arial'>
                      <MinusCircleOutlined /> {" "}
                      Balance: {checkNaN(user?.balance)} {user?.currency} &nbsp;
                      Equity: {checkNaN(equity_g)} &nbsp;
                      Credit: {checkNaN(user?.credit)}  &nbsp;
                      Bonus: {checkNaN(user?.bonus)}  &nbsp;
                      <span> Margin: {checkNaN(grandMargin)}</span>&nbsp;
                      Free Margin: {checkNaN(free_margin)} &nbsp;
                      <span>Margin Level: {checkNaN(margin_level)} %</span> &nbsp;
                      Total Withdraw: {checkNaN(user?.total_withdraw)}  &nbsp;
                    </span>
                  </TableCell>
                  <TableCell align="center" >{checkNaN(totalCommission)}</TableCell>
                  <TableCell align="center" >{checkNaN(totalSwap)}</TableCell>
                  <TableCell align="center" >{checkNaN(grandProfit)}</TableCell>
                  <TableCell align="center"  colSpan={3}></TableCell>
            </StyledTableRow> 
        </TableBody>
      </Table>
    </TableContainer>
     <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <EditActiveOrders 
          setIsModalOpen={setIsModalOpen}
          activeOrder={activeOrder}
          fetchActiveOrders={fetchActiveOrders}
        
        />
      </CustomModal>
     </>   
  );
}
