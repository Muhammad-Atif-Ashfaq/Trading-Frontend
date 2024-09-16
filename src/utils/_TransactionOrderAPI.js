import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;



export const Save_Transaction_Order  = async(TransactionOrderData, token)=>{
  const res = await _API(`${apiUrl}/admin/transaction_order`,'post',TransactionOrderData, token)
  return res 
}


export const Get_Transaction_Orders  = async(trading_account_id, token,page,brand_id)=>{
    
const res = await _API(`${apiUrl}/admin/transaction_order?page=${page}&trading_account_id=${trading_account_id}`, 'get', [], token);
  return res;
}
