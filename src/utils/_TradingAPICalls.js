import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const Trading_Accounts_List = async(token,brandId,page = 1, perPage = 10, searchValues) =>{
  const queryParams = new URLSearchParams(searchValues).toString();
  let url  = `${apiUrl}/admin/trading_accounts?page=${page}&per_page=${perPage}&${queryParams}`

  if(brandId){
  
    url  =  `${apiUrl}/admin/trading_accounts?page=${page}&per_page=${perPage}&brand_id=${brandId}&${queryParams}`
   
  }
  const mBrands = await _API(url,'get',[],token)
   return mBrands
}

export const Search_Trading_Accounts_List = async(token, page = 1, perPage = 10,searchValues)=>{
      
  const queryParams = new URLSearchParams(searchValues).toString();
  const apiUrlWithParams = `${apiUrl}/admin/trading_accounts?page=${page}&per_page=${perPage}&${queryParams}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
}

export const Save_Trading_Account = async(TradingAccountData, token)=>{
  const res = await _API(`${apiUrl}/admin/trading_accounts`,'post',TradingAccountData, token)
  return res 
}


export const Put_Trading_Account = async(id,tradingAccountData, token)=>{
    const queryParams = new URLSearchParams(tradingAccountData).toString();
    const url = `${apiUrl}/admin/trading_accounts/${id}?${queryParams}`;
  const res = await _API(url,'put',null, token)
  return res 
}

export const Update_Trading_Account = async(id, tradingAccountData, token)=>{
  const queryParams = new URLSearchParams(tradingAccountData).toString();
  const url = `${apiUrl}/admin/trading_accounts/${id}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res
}

export const  Get_Single_Trading_Account = async(id, token)=>{
  
  const res = await _API(`${apiUrl}/admin/trading_accounts/${id}`,'get',[], token)
  return res 
}

export const Delete_Trading_Account = async(TradingID, token)=>{
  const res = await _API(`${apiUrl}/admin/trading_accounts/${TradingID}`,'delete',[],token)
  return res
}


export const Get_Trade_Order = async({trading_account_id,OrderTypes=['market', 'pending'],brandId,token,page = 1, perPage= 10000, searchValues})=>{
 
  let apiRoute = null;
  const queryParams = new URLSearchParams(searchValues).toString();
  const orderTypeQuery = OrderTypes?.map(type => `order_type[]=${type}`).join('&');
     apiRoute = `${apiUrl}/admin/trade_orders/?page=${page}&per_page=${perPage}&${orderTypeQuery}&${queryParams}`
  
  if(trading_account_id)
  {
    apiRoute = `${apiUrl}/admin/trade_orders/?page=${page}&per_page=${perPage}&trading_account_id=${trading_account_id}&${orderTypeQuery}`;
  }
  if(brandId){
    apiRoute = `${apiUrl}/admin/trade_orders/?page=${page}&per_page=${perPage}&brandId=${brandId}&${orderTypeQuery}`;
  }
    

  const res = await _API(apiRoute, 'get', [], token);
  
  return res;
}
export const Search_Live_Order = async (token, page = 1, perPage = 10, searchValues = {}) => {
  const searchParams = new URLSearchParams(searchValues);
  searchParams.append('page', page);
  searchParams.append('per_page', perPage);
  searchParams.append('order_type[]', 'market'); 
  const apiUrlWithParams = `${apiUrl}/admin/trade_orders?${searchParams.toString()}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
};
export const Search_Close_Order = async (token, page = 1, perPage = 10, searchValues = {}) => {
  const searchParams = new URLSearchParams(searchValues);
  searchParams.append('page', page);
  searchParams.append('per_page', perPage);
  searchParams.append('order_type[]', 'close'); 
  const apiUrlWithParams = `${apiUrl}/admin/trade_orders?${searchParams.toString()}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
};
export const Search_Pending_Order = async (token, page = 1, perPage = 10, searchValues = {}) => {
  const searchParams = new URLSearchParams(searchValues);
  searchParams.append('page', page);
  searchParams.append('per_page', perPage);
  searchParams.append('order_type[]', 'pending'); 
  const apiUrlWithParams = `${apiUrl}/admin/trade_orders?${searchParams.toString()}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
};
export const Get_Single_Trade_Order = async(id,token)=>{

  const res = await _API(`${apiUrl}/admin/trade_orders/${id}`, 'get', [], token);
  return res;
}

export const Post_Trade_Order = async(TradeOrderData, token)=>{
  const res = await _API(`${apiUrl}/admin/trade_orders`,'post',TradeOrderData,token)
  return res
}

export const Post_Group_Trade_Order = async(TradeOrderData, token)=>{
  const res = await _API(`${apiUrl}/admin/group_trade_orders`,'post',TradeOrderData,token)
  return res
}

// export const Put_Trade_Order = async(id, paramsString, token)=>{
//   const res = await _API(`${apiUrl}/admin/trade_orders/${id}?${paramsString}`,'put',[],token)
//   return res
// }

 export const Put_Trade_Order = async (id, orderData, token) => {
  const queryParams = new URLSearchParams(orderData).toString();
  const url = `${apiUrl}/admin/trade_orders/${id}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res

}

export const Delete_Trade_Order = async(id,token)=>{
   const res = await _API(`${apiUrl}/admin/trade_orders/${id}`,'delete',[],token)
  return res
}

export const All_TradingAccountList = async (token, searchValues = {}) => {
  const searchParams = new URLSearchParams(searchValues);
  const apiUrlWithParams = `${apiUrl}/admin/getAllTradingAccountList?${searchParams.toString()}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
};