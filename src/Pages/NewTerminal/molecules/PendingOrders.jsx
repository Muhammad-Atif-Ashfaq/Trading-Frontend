import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {  EditOutlined,DeleteOutlined } from '@mui/icons-material';
import { Search_Pending_Order } from '../../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import { theme,Space } from 'antd';
import Swal from 'sweetalert2';
import CustomNotification from '../../../components/CustomNotification';
import { getValidationMsg } from '../../../utils/helpers';
import { GenericDelete } from '../../../utils/_APICalls';
import CustomModal from '../../../components/CustomModal';
import EditPendingOrder from './EditPendingOrder';
import {  checkNaN } from '../../../utils/helpers';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Skeleton } from '@mui/material';
import usePusher from '../../../pusher/usePusher';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
    //  width: 200,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    //  width: 200,
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


export default function PendingOrders() {
  
   const [rows,setRows] = React.useState([])
   const [isModalOpen, setIsModalOpen] = React.useState(false);
   const [pendingOrder,setPendingOrder] = React.useState(null)
   const token = useSelector(({ terminal }) => terminal?.user?.token)
   const user = useSelector((state)=>state?.terminal?.user?.trading_account)
   const trading_account_id = useSelector((state) => state?.terminal?.user?.trading_account?.id)
   const orderRefresh = useSelector((state)=> state?.terminal?.orderRefresh)

   const {token: { colorPrimary }} = theme.useToken();

     const tradeOrderUpdation = usePusher('trade_orders','update')



  const fetchPendingOrders = async()=>{
     const res = await Search_Pending_Order(token,1,10,{trading_account_id,order_types:['pending']})
    setRows(res?.data?.payload?.data)
  }


  const deleteHandler = async (id) => {
    const params = {
      table_name:"trade_orders",
      table_ids : [id]
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async( result )=> {
      if (result.isConfirmed) {
        const res = await GenericDelete(params, token)
        const { data: { success, message, payload } } = res
        if(success) {
          CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
          fetchPendingOrders()
        }
        else {
          const errorMsg = getValidationMsg(message, payload)
          if(errorMsg) 
            CustomNotification({
              type: "error",
              title: "Oppssss..",
              description: errorMsg,
              key: "b4",
            })
          else
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
    setPendingOrder(order)
    setIsModalOpen(true)
  }

   const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };


React.useEffect(()=>{
  fetchPendingOrders()
},[orderRefresh,tradeOrderUpdation])


  return (
    <>
     <StyledTableContainer component={Paper}>
      <Table sx={{ minWidth: 1100 }} aria-label="customized table">
        <FixedTableHead>
          <StyledTableRow>
            <StyledTableCell align="center">Symbol</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Open Price</StyledTableCell>
            <StyledTableCell align="center">Volume</StyledTableCell>
            <StyledTableCell align="center">TP</StyledTableCell>
            <StyledTableCell align="center">SL</StyledTableCell>
            <StyledTableCell align="center">Comment</StyledTableCell>
            
            <StyledTableCell align="center" colSpan={2}>Actions</StyledTableCell>
          </StyledTableRow>
        </FixedTableHead>
        <TableBody>
          {rows?.length ? ( rows?.map((row) => (
            <StyledTableRow key={row?.id}>
              <StyledTableCell  align="center">{row?.symbol}</StyledTableCell>
              <StyledTableCell align="center">{row?.type ? row?.type :"-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.open_price ? row?.open_price :"-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.volume ? row?.volume : "-" }</StyledTableCell>
              <StyledTableCell align="center">{row?.takeProfit ? row?.takeProfit : "-"}</StyledTableCell>
              <StyledTableCell align="center">{row?.stopLoss? row?.stopLoss: "-" }</StyledTableCell>
              <StyledTableCell align="center">{row?.comment ? row?.comment : "-"}</StyledTableCell>
              <TableCell align="center" colSpan={2}>
                <Space size="middle" className='cursor-pointer'>
                  <EditOutlined 
                   style={{fontSize:"20px", color: colorPrimary }}
                   onClick={(e)=>{
                    e.stopPropagation();
                    editHandler(row)
                   }}
                   />
                <DeleteOutlined style={{fontSize:"24px", color: colorPrimary }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(row?.id);
                  }}
                  />
                </Space >
              </TableCell>
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
                          </TableCell>
                    </StyledTableRow> 
                        )}
            <StyledTableRow>
                  <TableCell colSpan={12}>
                    <span className='text-xs font-bold text-arial'>
                    <MinusCircleOutlined /> {" "}
                    Balance: {checkNaN(user?.balance)} {user?.currency} &nbsp;
                    Credit: {checkNaN(user?.credit)}  &nbsp;
                    Bonus: {checkNaN(user?.bonus)}  &nbsp;
                  </span>
                </TableCell>
            </StyledTableRow>                

          
        </TableBody>
      </Table>
     </StyledTableContainer>
     <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={null}
        >
          <EditPendingOrder
          setIsModalOpen={setIsModalOpen}
          pendingOrder={pendingOrder}
          fetchPendingOrders={fetchPendingOrders}
        
        />
     </CustomModal>
    </>
   
  );
}
