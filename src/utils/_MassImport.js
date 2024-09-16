import { _API } from "./_API";
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const massImport   = async (params,token) => {
    const res = await _API(`${apiUrl}/admin/massImport`,'post',params, token)
    return res
  }