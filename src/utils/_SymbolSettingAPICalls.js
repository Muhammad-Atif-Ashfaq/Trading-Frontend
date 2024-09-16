import { _API } from "./_API"
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const SymbolSettingPost = async (SymbolSetting, token) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting`, 'post', SymbolSetting, token)
    return res
}
export const Symbol_Group_List = async (token) => {
    const res = await _API(`${apiUrl}/admin/symbel_group`, 'get', [], token)
    return res
}

export const ALL_Symbol_Group_List = async (token) => {
    const res = await _API(`${apiUrl}/admin/getAllSymbelGroupList`, 'get', [], token)
    return res
}
export const ALL_Symbol_Group_List_Skip = async (token) => {
    const res = await _API(`${apiUrl}/admin/getAllSymbelGroupList?skipRow=1`, 'get', [], token)
    return res
}

export const Feed_Data_List = async (token) => {
    const res = await _API(`${apiUrl}/admin/data_feed`, 'get', [], token)
    return res
}


export const All_Setting_Data = async (token, page = 1, perPage = 10, searchValues) => {
    const queryParams = new URLSearchParams(searchValues).toString();
    const apiUrlWithParams = `${apiUrl}/admin/symbel_setting?page=${page}&per_page=${perPage}&${queryParams}`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
};

export const AllSymbelSettingList = async (token,params={}) => {
    
    const queryParams = new URLSearchParams(params).toString();
    const apiUrlWithParams = `${apiUrl}/admin/getAllSymbelSettingList?${queryParams}`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
};


export const DeleteSymbolSetting = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting/${id}`, 'delete', [], token)
    return res
}
export const SelectSymbolSettingsWRTID = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting/${id}`, 'get', [], token)
    return res
}

export const UpdateSymbolSettings = async (SymbolSettingsID, SymbolSettingsData, token) => {
    const queryParams = new URLSearchParams(SymbolSettingsData).toString();
    const url = `${apiUrl}/admin/symbel_setting/${SymbolSettingsID}?${queryParams}`;
    const res = await _API(url, 'put', null, token);
    return res
}

export const Trading_Active_Group = async (token, status,brandId,page) => {

    let url =`${apiUrl}/admin/trading_accounts?status=${status}&page=${page}`
    if(brandId){
        url= `${apiUrl}/admin/trading_accounts?status=${status}&page=${page}&brand_id=${brandId}`
    }

    const res = await _API(url, 'get', [], token)

    return res
}

export const Trading_Margin_Calls = async (token, status,brandId,page) => {
    let url =`${apiUrl}/admin/trading_accounts?page=${page}&status=${status}`
    if(brandId){
        url= `${apiUrl}/admin/trading_accounts?page=${page}&status=${status}&brand_id=${brandId}`
    }

    const res = await _API(url, 'get', [], token)
    return res
}

// export const Trading_Transaction_Order = async (token,brandId,page) => {
//    let url = `${apiUrl}/admin/transaction_order?page=${page}`
//     if(brandId){
//      url = `${apiUrl}/admin/transaction_order?brand_id=${brandId}&page=${page}`
//     }
//     const res = await _API(url, 'get', [], token)
//     return res
// }

export const Trading_Transaction_Order = async (token,brandId, page = 1, perPage = 10,searchValues) => {
    
    let url = `${apiUrl}/admin/transaction_order?page=${page}&per_page=${perPage}`
    const params = {brand_id:brandId}
    const queryParams = new URLSearchParams(params).toString();
    if(brandId){
     url = `${apiUrl}/admin/transaction_order?page=${page}&per_page=${perPage}&${queryParams}`;

    }
    const res = await _API(url, 'get', [], token);
    return res;
};
export const Search_Transaction_Ordcer = async(token, page = 1, perPage = 10,searchValues)=>{
      
    const queryParams = new URLSearchParams(searchValues).toString();
    const apiUrlWithParams = `${apiUrl}/admin/transaction_order?page=${page}&per_page=${perPage}&${queryParams}`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
}

export const Update_Trading_Transaction_Order = async (brandId,transactionOrderID,transactionOrderData, token) => {
    
    let queryParams = new URLSearchParams(transactionOrderData).toString();
    if(brandId)
    {
      queryParams = {...queryParams, brand_id:brandId}
    }
    let url = `${apiUrl}/admin/transaction_order?${transactionOrderID}&${queryParams}`
    const res = await _API(url, 'put', [], token);
    return res;
}


export const Single_Transaction_Order = async (token,id,page) => {
   let url = `${apiUrl}/admin/transaction_order/${id}?page=${page}`
   
    const res = await _API(url, 'get', [], token)
    return res
}