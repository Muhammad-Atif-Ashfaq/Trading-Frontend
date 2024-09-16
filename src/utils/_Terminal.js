import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;



export const TerminalLogin = async ({login_id, password,brand_id})=> {
    const mLogin = await _API(`${apiUrl}/terminal/login`,'post',{login_id, password,brand_id})
    return mLogin
}

export const TerminalLogout = async (token)=> {
    const mLogout = await _API(`${apiUrl}/terminal/logout`,'get',[],token)
    return mLogout
}


export const TerminalValidationKey = async (brand_id,domain)=> {
    const mValidation = await _API(`${apiUrl}/terminal/is_valid_brand/${domain}/${brand_id}`,'post')
    return mValidation
}

export const GetTerminalSymbolsList   = async (token) => {
    const res = await _API(`${apiUrl}/terminal/symbels`, 'get', [], token)
  return res
}