import axios from "axios"
import { _API } from "./_API"
import CustomNotification from "../components/CustomNotification"


// export const GetCryptoData = async () => {
//     const res = await axios.get(`https://api.binance.com/api/v3/exchangeInfo`)
//     return res
// }

export const GetCryptoData = async () => {
  const res = await axios.get(`https://api.binance.com/api/v3/exchangeInfo`);
  return res.data.symbols;
};

export const SeparateSymbols = async () => {
  const symbols = await GetCryptoData();
  
    const fiatQuoteAssets = ['USD', 'USDT', 'EUR', 'BUSD', 'AUD', 'GBP', 'BRL'];
    
    const groupedSymbols = symbols.map(item => {
        if (fiatQuoteAssets.includes(item.quoteAsset)) {
            return { ...item, group: 'forex' ,name: item.symbol};
        } else {
            return { ...item, group: 'crypto',name: item.symbol };
        }
    });
  return  groupedSymbols ;
};


export const GetFasciData = async (access_key) => {

  const formatData = (data, group) => {
    return data.map(item => ({
      id: item?.id, 
      name: item?.symbol ? item?.symbol :item?.name, 
      group: group
    }));
  }
 
      try {
        let forexData=[];
        let cryptoData=[];
        let stockData=[];

        const forexResponse = await axios.get(`${import.meta.env.VITE_FSCI_API}forex/list?type=forex&access_key=${access_key}`);
        if(forexResponse.data.status){
           forexData = await forexResponse.data.response;
        }else{
          CustomNotification({ type: "error", title: "Opps", description: `forex ${forexResponse.data.msg}`, key: 1 })
        }

        const cryptoResponse = await axios.get(`${import.meta.env.VITE_FSCI_API}crypto/list?type=crypto&access_key=${access_key}`);
        if(cryptoResponse.data.status){
          cryptoData = await cryptoResponse.data.response;
       }else{
         CustomNotification({ type: "error", title: "Opps", description: `crypto ${cryptoResponse.data.msg}`, key: 1 })
       }

        const stockResponse = await axios.get(`${import.meta.env.VITE_FSCI_API}stock/list?country=United-states&access_key=${access_key}`);
        if(stockResponse.data.status){
          stockData = await stockResponse.data.response;
       }else{
         CustomNotification({ type: "error", title: "Opps", description: `stock ${stockResponse.data.msg}`, key: 1 })
       } 

        // Format the data into options array with appropriate structure
         const formattedForexData = formatData(forexData, 'Forex');
         const formattedCryptoData = formatData(cryptoData, 'Crypto');
         const formattedStockData = formatData(stockData, 'Stock')
        const formattedOptions = [...formattedForexData, ...formattedCryptoData, ...formattedStockData];

       return formattedOptions
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    
}

export const GetAskBidData = async (symbol) => {
    const res = await axios.get(`${import.meta.env.VITE_BINANCE_API}?symbol=${symbol}`)
    return res
}