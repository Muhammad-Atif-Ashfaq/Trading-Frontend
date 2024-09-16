import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const GetBrandsList   = async (token) => {
  const res = await _API(`${apiUrl}/admin/getAllBrandList`, 'get', [], token)
  return res
}

export const GetAllBrandsCustomerList   = async (token,public_key) => {
    const res = await _API(`${apiUrl}/admin/getAllBrandCustomerList?brand_id=${public_key}`, 'get', [], token)
  return res
}