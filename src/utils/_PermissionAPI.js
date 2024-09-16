import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const SaveBrandPermission   = async (PermissionData,token) => {
  const res = await _API(`${apiUrl}/admin/assign_permission`,'post',PermissionData, token)
  return res
}