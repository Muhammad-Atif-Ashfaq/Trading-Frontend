import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const GetDataFeeds = async (token) => {
  const res = await _API(`${apiUrl}/admin/data_feed`, 'get', [], token)
  return res
}

export const getFeedServer = async (token) => {
  const res = await _API(`${apiUrl}/config/getConfigDataFeeds`, 'get', [], token)
  return res
}

export const feedDataPost = async (allFeedData, token) => {
  const res = await _API(`${apiUrl}/admin/data_feed`, 'post', allFeedData, token)
  return res
}

export const DeleteSymbolData = async (id, token) => {
  const res = await _API(`${apiUrl}/admin/data_feed/${id}`, 'delete', [], token)
  return res
}

export const SelectFeedDataById = async (id, token) => {
  const res = await _API(`${apiUrl}/admin/data_feed/${id}`, 'get', [], token)
  return res
}

export const UpdateDataFeed = async (id, allFeedData, token) => {
  const queryParams = new URLSearchParams(allFeedData).toString();
  const url = `${apiUrl}/admin/data_feed/${id}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res
}