import { _API } from "./_API";
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const Trading_Account_Group_List = async (token, brandId) => {
  let url = `${apiUrl}/admin/trading_account_groups`;
  if (brandId) {
    url = `${apiUrl}/admin/trading_account_groups?brand_id=${brandId}`
  }
  const res = await _API(url, 'get', [], token)
  return res
}

export const Search_Trading_Account_Group_List = async (token, page = 1, perPage = 10, searchValues) => {

  const queryParams = new URLSearchParams(searchValues).toString();
  const apiUrlWithParams = `${apiUrl}/admin/trading_account_groups?page=${page}&per_page=${perPage}&${queryParams}`;
  const res = await _API(apiUrlWithParams, 'get', [], token);
  return res;
}

export const ALL_Trading_Account_Group_List = async (token, public_key) => {

  const queryParams = new URLSearchParams({ brand_id: public_key }).toString();
  let res;
  if (public_key) {
    res = await _API(`${apiUrl}/admin/getAllTradingGroupList?${queryParams}`, 'get', [], token)
    return res
  }
  res = await _API(`${apiUrl}/admin/getAllTradingGroupList`, 'get', [], token)
  return res
}

export const SaveTradingAccountGroups = async (TradingAccountGroupData, token) => {
  const res = await _API(`${apiUrl}/admin/trading_account_groups`, 'post', TradingAccountGroupData, token)
  return res
}
export const UpdateTradingAccountGroups = async (TradingGroupID, TradingGroupData, token) => {
  const queryParams = new URLSearchParams(TradingGroupData).toString();
  const url = `${apiUrl}/admin/trading_account_groups/${TradingGroupID}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res

}
export const SelectTradingAccountGroupWRTID = async (id, token) => {
  const res = await _API(`${apiUrl}/admin/trading_account_groups/${id}`, 'get', [], token)
  return res
}
export const DeleteTradingAccountGroup = async (id, token) => {
  const res = await _API(`${apiUrl}/admin/trading_account_groups/${id}`, 'delete', [], token)
  return res
}

export const getAllTradingAccountsNotInGroup = async (token, brandId) => {


  let url = `${apiUrl}/admin/getAllTradingAccountsNotInGroup`
  if (brandId) {
    url = `${apiUrl}/admin/getAllTradingAccountsNotInGroup?brand_id=${brandId}`
  }
  const res = await _API(url, 'get', [], token)
  return res
}