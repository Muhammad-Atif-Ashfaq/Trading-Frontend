import { Symbol_Group_List } from "./_SymbolGroupAPI"
export const FetchData = async (page, token, perPage=10) =>{
    const res = await Symbol_Group_List(token,page,parseInt(perPage))
    return res;
}