import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const getGraphsData   = async (token, params, date) => {
  const res = await _API(`${apiUrl}/admin/getDashboardData`, 'post', params, token)
  // const res = await _API(`${apiUrl}/admin/getDashboardData`, 'post', {'types':[graphname,'trading_volume_by_lots','deposits']}, token)
  return res
}

// export const GetAllBrandsCustomerList   = async (token,public_key) => {
//     const res = await _API(`${apiUrl}/admin/getAllBrandCustomerList?brand_id=${public_key}`, 'get', [], token)
//   return res
// }