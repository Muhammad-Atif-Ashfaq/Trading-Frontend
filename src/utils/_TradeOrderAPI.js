import { _API } from "./_API"
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const deleteOrder = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/trade_orders/${id}`, 'delete', [], token)
    return res
}

export const GET_Group_Trade_Order = async (token, page = 1, perPage = 10,searchValues) => {
const queryParams = new URLSearchParams(searchValues).toString();
  const apiUrlWithParams = `${apiUrl}/admin/group_trade_orders?page=${page}&per_page=${perPage}&${queryParams}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
}

export const GET_Group_Transaction_Order = async (token, page = 1, perPage = 10,searchValues) => {
    const queryParams = new URLSearchParams(searchValues).toString();
  const apiUrlWithParams = `${apiUrl}/admin/group_transaction_orders?page=${page}&per_page=${perPage}&${queryParams}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
}

export const GET_Min_Chart_Data = async (token, page = 1, perPage = 10, searchValues) => {
    const queryParams = new URLSearchParams(searchValues).toString();
    const apiUrlWithParams = `${apiUrl}/admin/charts?page=${page}&per_page=${perPage}&${queryParams}`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
}

export const Save_Group_Order = async (TransactionOrderGroupData, trading_group_id, token) => {
    const res = await _API(`${apiUrl}/admin/group_transaction_orders?trading_group_id=${trading_group_id}`, 'post', TransactionOrderGroupData, token)
    return res
}