import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const getActiveIPs = async (token) => {
    const res = await _API(`${apiUrl}/admin/get_ip_list`, 'get', [], token)
    return res
  }
  export const Search_Active_IP = async (token, page = 1, perPage = 10, searchValues = {}) => {
    const searchParams = new URLSearchParams(searchValues);
    searchParams.append('page', page);
    searchParams.append('per_page', perPage);
    const apiUrlWithParams = `${apiUrl}/admin/get_ip_list`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
  };
  export const Search_Blocked_IP = async (token, page = 1, perPage = 10, searchValues = {}) => {
    const searchParams = new URLSearchParams(searchValues);
    searchParams.append('page', page);
    searchParams.append('per_page', perPage);
    const apiUrlWithParams = `${apiUrl}/admin/get_block_list`;
    const res = await _API(apiUrlWithParams, 'get', [], token);
    return res;
  };
  export const getBlockedIps = async (token) => {
    const res = await _API(`${apiUrl}/admin/get_block_list`, 'get', [], token)
    return res
  }
  export const addToBlack_List = async (data, token) => {
    const res = await _API(`${apiUrl}/admin/add_to_block_list`, 'post', data, token)
    return res
  }
  export const addIp_To_List = async (data, token) => {
    const res = await _API(`${apiUrl}/admin/add_to_ip_list`, 'post', data, token)
    return res
  }