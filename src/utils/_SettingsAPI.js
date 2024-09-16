import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const SetSettings = async(settingsData, token)=>{
    const res = await _API(`${apiUrl}/setting/setSettings`,'post',settingsData, token)
    return res 
  }
  export const GetSettings = async(namesArr, token)=>{
    const res = await _API(`${apiUrl}/setting/getSettings`,'post',namesArr, token)
    return res 
  }