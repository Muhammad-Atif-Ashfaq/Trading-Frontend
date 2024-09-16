import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;


export const ChangingPassword = async (new_password, token) => {
    
    const res = await _API(`${apiUrl}/admin/change-password`, 'post', new_password, token)
    return res

}