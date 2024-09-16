import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { Search_Close_Order } from '../../../utils/_TradingAPICalls';
import moment from 'moment';
import { theme, } from 'antd';
import {checkNaN} from '../../../utils/helpers';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Skeleton } from '@mui/material';
import usePusher from '../../../pusher/usePusher';





const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
    fontSize:"12px",
    // width: 200,

  },
  [`&.${tableCellClasses.body}`]: {
      fontSize:"12px",
      // width: 200,


  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
 
  // hide last border
  'td,th': {
    padding:0
  },
   '&:last-child td, &:last-child th': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FixedTableHead = styled(TableHead)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.background.default,
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: '200px',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});


export default function OrdersHistory() {

   const [rows,setRows] = React.useState([])
   const token = useSelector(({ terminal }) => terminal?.user?.token)
   const user = useSelector((state)=>state?.terminal?.user?.trading_account)
   const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
   const {
    token: { colorPrimary },
  } = theme.useToken();
  

  const tradeOrderUpdation = usePusher('trade_orders','update')



  const fetchOrdersHistory = async()=>{

 
    const res = await Search_Close_Order(token,1,10,{trading_account_id,order_types:['close']})
     setRows(res?.data?.payload?.data)
  }

  React.useEffect(()=>{
  fetchOrdersHistory()
},[tradeOrderUpdation])

let totalSwap = 0;
  let totalProfit = 0;
  let totalCommission = 0;

  rows?.forEach(row => {
    totalSwap += parseFloat(row?.swap || 0);
    totalProfit += parseFloat(row?.profit || 0);
    totalCommission += parseFloat(row?.commission || 0);
  })
    

  return (
    <StyledTableContainer component={Paper}>
      <Table sx={{ minWidth: 1400 }} aria-label="customized table">
       
          <FixedTableHead>
            <StyledTableCell align="center">Symbol</StyledTableCell>
            <StyledTableCell align="center">ID</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Volume</StyledTableCell>
            <StyledTableCell align="center">TP</StyledTableCell>
            <StyledTableCell align="center">SL</StyledTableCell>
            <StyledTableCell align="center">Open Price</StyledTableCell>
            <StyledTableCell align="center">Close Price</StyledTableCell>
            <StyledTableCell align="center">Open Time</StyledTableCell>
            <StyledTableCell align="center">Close Time</StyledTableCell>
            <StyledTableCell align="center">Comment</StyledTableCell>
            <StyledTableCell align="center">Swap</StyledTableCell>
            <StyledTableCell align="center">Profit</StyledTableCell>
            <StyledTableCell align="center">Commission</StyledTableCell>
          </FixedTableHead>

          <TableBody>
          {rows?.length ? ( rows?.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell  align="center">
                {row.symbol}
              </StyledTableCell>
              <StyledTableCell align="center">{row?.id}</StyledTableCell>
              <TableCell sx={{color:"#0ECB81"}} align="center">{row.type}</TableCell>
              <StyledTableCell align="center">{row?.volume}</StyledTableCell>
              <StyledTableCell align="center">{ row?.take_profit ? row?.take_profit:"-"}</StyledTableCell>
              <StyledTableCell align="center">{ row?.stop_loss ? row?.stop_loss:"-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.open_price}</StyledTableCell>
              <StyledTableCell align="center">{row?.close_price}</StyledTableCell>
              <StyledTableCell align="center">{moment(row?.open_time).format('D MMMM YYYY h:mm:ss A')}</StyledTableCell>
              <StyledTableCell align="center">{moment(row?.close_time).format('D MMMM YYYY h:mm:ss A') }</StyledTableCell>
              <StyledTableCell align="center"> { row?.comment }</StyledTableCell>
              <StyledTableCell align="center">{ row?.swap}</StyledTableCell>
              <StyledTableCell align="center">{ parseFloat(row?.profit)?.toFixed(2)}</StyledTableCell>
              <StyledTableCell align="center">{ row?.commission}</StyledTableCell>
             
            </StyledTableRow>
                        ))): 
                        (
                          <StyledTableRow>
                              <TableCell colSpan={12}>
                                <Skeleton animation="wave" p={1.5} />
                                <Skeleton animation="wave" p={1.5} />
                                <Skeleton animation="wave" p={1.5} />
                                <Skeleton animation="wave"  p={1.5}/>
                                <Skeleton animation="wave" p={1.5} />
                                <Skeleton animation="wave" p={1.5} />
                              </TableCell>
                          </StyledTableRow> 
                        )}
            <StyledTableRow>
                  <TableCell colSpan={11}>
                    <span className='text-xs font-bold text-arial'>
                    <MinusCircleOutlined /> {" "}
                    Balance: {checkNaN(user?.balance)} {user?.currency} &nbsp;
                    Credit: {checkNaN(user?.credit)}  &nbsp;
                    Bonus: {checkNaN(user?.bonus)}  &nbsp;
                  </span>
                </TableCell>
               
                    <TableCell align="center" > {totalSwap} &nbsp;</TableCell> 
                    <TableCell align="center" > {totalProfit} &nbsp;</TableCell> 
                    <TableCell align="center" > {totalCommission} &nbsp;</TableCell> 
                     
                 
                
            </StyledTableRow>             
          </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
