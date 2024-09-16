import { _API } from "./_API";
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;


export const SaveSymbolGroups = async (SymbolGroupData, token) => {
  const res = await _API(`${apiUrl}/admin/symbel_group`, 'post', SymbolGroupData, token)
  return res

}
export const UpdateSymbolGroups = async (SymbolID, SymbolGroupData, token) => {
  const queryParams = new URLSearchParams(SymbolGroupData).toString();
  const url = `${apiUrl}/admin/symbel_group/${SymbolID}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res

}


export const Symbol_Group_List = async (token, page = 1, perPage = 10, searchValues) => {
    const queryParams = new URLSearchParams(searchValues).toString();
    const apiUrlWithParams = `${apiUrl}/admin/symbel_group?page=${page}&per_page=${perPage}&${queryParams}`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
};

export const SelectSymbolWRTID = async (id, token) => {
  const res = await _API(`${apiUrl}/admin/symbel_group/${id}`, 'get', [], token)
  return res
}

export const DeleteSymbolsGroup = async (id, token) => {
  const res = await _API(`${apiUrl}/admin/symbel_group/${id}`, 'delete', [], token)
  return res
}
