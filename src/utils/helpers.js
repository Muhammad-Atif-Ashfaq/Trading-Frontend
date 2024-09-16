import Swal from "sweetalert2";
import CustomNotification from "../components/CustomNotification";
import axios from "axios";
import { LeverageList } from "./constants";

export const CustomDeleteDeleteHandler = async (id, token, _API, setIsLoading, fetchData) => {

  setIsLoading(true)
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1CAC70",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await _API(id, token)
      const { data: { success, message, payload } } = res
      setIsLoading(false)
      if (success) {
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        fetchData()
      } else {
        Swal.fire({
          title: "Opps!",
          text: "Somthing went wrong from server side",
          icon: "error"
        });
      }

    }
  });

  setIsLoading(false)

}

export const CustomBulkDeleteHandler = async (Params, token, _API, setLoading, successCallBack) => {
  if (Params.table_ids.length > 0) {
    setLoading(true)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true)
        const res = await _API(Params, token)
        const { data: { success, message, payload } } = res
        setLoading(false)

        if (success) {
          successCallBack(message)
        } else {
          CustomNotification({
            type: "error",
            title: "Oppssss..",
            description: message,
            key: "b4",
          })
        }

      }
    });


  }
}

export const ColumnSorter = (a, b) => {

  return a?.toString().localeCompare(b?.toString());
}


export const ColumnSpaceSorter = (a, b) => {
  //  const valueA = a === null || a === undefined || a === '' ? Infinity : a;
  // const valueB = b === null || b === undefined || b === '' ? Infinity : b;

  // if (valueA === valueB) {
  //   return 0;
  // }

  // return valueA < valueB ? -1 : 1;

  if (a && b) {
    return a - b;
  } else if (a) {
    // That means be has null rechargeType, so a will come first.
    return -1;
  } else if (b) {
    // That means a has null rechargeType so b will come first.
    return 1;
  }

  // Both rechargeType has null value so there will be no order change.
  return 0;

};


export const CheckBrandPermission = (permissions, userRole, permissionName) => {
  if (userRole === 'brand') {
    const res = permissions?.find((permission) => permission?.name === permissionName);
    return res ? true : false;
  }
  return true;
}

export const getOpenPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      ws.send(JSON.stringify({ method: 'SUBSCRIBE', params: [`${symbol.toLowerCase()}@ticker`], id: 1 }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.s === symbol.toUpperCase() && message.o) {
        const openPrice = parseFloat(message.o);
        ws.close();
        resolve(openPrice);
      }
    };

    ws.onerror = (error) => {
      ws.close();
      reject(error);
    };

    ws.onclose = () => {
      // WebSocket connection closed
    };
  });
};

export const getOpenPriceFromAPI = async (symbol, feedName) => {

  try {
    if (feedName === 'binance') {

      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol?.feed_fetch_name}`);
      const data = await response.json();
      const { askPrice, bidPrice } = data

      return { askPrice, bidPrice };
    } else {
    
      const response = await fetch(`https://fcsapi.com/api-v3/${symbol?.feed_fetch_key}/latest?symbol=${symbol?.feed_fetch_name}&access_key=${symbol?.data_feed?.feed_login}`);
      const data = await response.json();
      const { o , c } = data?.response[0]

      return { askPrice:o , bidPrice:c };
    }
  } catch (error) {
    console.error('Error fetching open price:', error);
    return { askPrice:null, bidPrice:null };
  }
}

export function numberFormat(number, decimals) {
  const fixedNumber = number.toFixed(decimals);
  return parseFloat(fixedNumber).toLocaleString('en-US', { minimumFractionDigits: decimals });
}

export function addZeroAfterOne(num) {
  let resultStr = '1';
  for (let i = 0; i < num; i++) {
    resultStr += '0';
  }
  return parseInt(resultStr);
}

export const isIncrement = (old_value, new_value) => {
  return old_value < new_value ? true : false
}

export const checkCurrencyPosition = (symbol, pricing, currency) => {

  const currencies = [];
  currencies.push(currency)
  const unit = parseFloat(symbol?.vol_min) * parseFloat(symbol?.lot_size)
  // Check for USD, EUR, or GBP at the beginning

  if (currencies.some(currency => symbol?.name.startsWith(currency))) {
    const pipValue = unit * parseFloat(symbol?.pip)
    return pipValue
  }

  // Check for USD, EUR, or GBP at the end

  const lastThree = symbol?.name.slice(-3);
  if (currencies.includes(lastThree)) {
    const pipValue = unit * parseFloat(symbol?.pip) / parseFloat(pricing.askPrice)
    return pipValue
  }

  // Not found
  const pipValue = unit * parseFloat(symbol?.pip) / parseFloat(pricing.openPrice)
  return pipValue;
}

export function addZeroBeforeOne(num) {
  let resultStr = '0.';
  for (let i = 0; i < num - 1; i++) {
    resultStr += '0';
  }
  resultStr += "1";
  return parseFloat(resultStr);
}
export const perPipProfit = (profit, num_of_pip) => {
  return (profit / num_of_pip)
}
export const calculateNumOfPip = (currentPrice, entryPrice, direction, pip) => {
  let profit = 0
  if (direction === 'buy') {
    profit = (parseFloat(currentPrice).toFixed(pip) - parseFloat(entryPrice).toFixed(pip));
  } else {
    profit = parseFloat(entryPrice).toFixed(pip) - parseFloat(currentPrice).toFixed(pip);
  }
  return (numberFormat(profit, pip) * addZeroAfterOne(pip))
}
export const calculateProfitLoss = (no_of_pip, volume) => {

  return no_of_pip * volume

}

export const calculateLotSize = (num, lotSize, currentPrice) => {
  return parseFloat((num * lotSize) * currentPrice).toFixed(2);
  // if(num >= 0.01 && num<0.10 ){
  //     return num*1000
  // }else if(num >= 0.10 && num < 1.00){
  //      return num*10000
  // }else{
  //     return num*100000
  // }
}

export const requiredMargin = (volume, accountLeverage) => {
  const lotsize = calculateLotSize(volume)
  return (volume * lotsize) / accountLeverage
}

export const calculateMarginCallPer = (equity, margin) => {
  return parseFloat((equity / margin) * 100).toFixed(2)
}

export const checkNaN = (val) => {
  return (isNaN(val) || !isFinite(val)) ? 0 : parseFloat(val).toFixed(2)
}

export const calculateFreeMargin = (equity, margin) => {
  return parseFloat((parseFloat(equity) - parseFloat(margin)))
}

export const calculateMargin = (lotSize, accountLeverage) => {
  return parseFloat(parseFloat(lotSize) / parseFloat(accountLeverage))
}

export const calculateEquity = (balance, grandProfit, credit, bonus) => {
    
  const equity = (parseFloat(balance) + parseFloat(grandProfit) + parseFloat(credit) + parseFloat(bonus)).toFixed(2);
  return equity
}

export const balanceCheck = (currentTradingAccountData) => {
  const result = (
    parseFloat(currentTradingAccountData?.free_margin)
    -
    parseFloat(currentTradingAccountData?.credit)
    -
    parseFloat(currentTradingAccountData?.bonus)
  )
    *
    (parseFloat(currentTradingAccountData?.brand?.margin_call) / 100)
  return (
    result
  )

}

export const conditionalLeverage = (trading_account, symbol_setting) => {
  let leverage;
  const symbol_group_id = symbol_setting?.group?.id;
  const trading_account_symbol_leverage = LeverageList?.find(x => x?.title === trading_account?.symbols_leverage?.find(x => x?.id == symbol_setting?.group?.id)?.settings?.find((x) => x.id === symbol_setting?.id)?.selectedLeverage?.title) || { value: '', title: '' }
  const trading_account_symbol_group_leverage = LeverageList?.find(x => x?.title === trading_account?.symbols_leverage?.find(x => x?.id == symbol_setting?.group?.id)?.selectedLeverage?.title) || { value: '', title: '' }
  const trading_account_leverage = LeverageList?.find(x => x?.title === trading_account?.leverage) || { value: '', title: '' }
  const trading_account_group_leverage = LeverageList?.find(x => x?.title === trading_account?.group?.mass_leverage) || { value: '', title: '' }
  const symbol_setting_leverage = LeverageList?.find(x => x?.title === symbol_setting?.leverage) || { value: '', title: '' }
  const symbol_setting_group_leverage = LeverageList?.find(x => x?.title === symbol_setting?.group?.leverage) || { value: '', title: '' }
  if (trading_account_group_leverage?.value) {
    leverage = trading_account_group_leverage?.value;
  } else
    if (trading_account_leverage?.value && symbol_group_id === 1) {
      leverage = trading_account_leverage?.value;
    } else
      if (trading_account_symbol_group_leverage?.value && symbol_group_id !== 1) {
        leverage = trading_account_symbol_group_leverage?.value;
      }
      else if (trading_account_symbol_leverage?.value && symbol_group_id !== 1) {
        leverage = trading_account_symbol_leverage?.value;
      }
      else if (symbol_setting_leverage?.value) {
        leverage = symbol_setting_leverage?.value;
      }
      else if (symbol_setting_group_leverage?.value) {
        leverage = symbol_setting_group_leverage?.value;
      }
      else {
        leverage = 1
      }
  return leverage


}


export const calculateNights = (startDate, endDate) => {

  const endTimestamp = new Date(endDate).getTime();
  // Set the start time for each day to 11 PM
  const startOfDay = new Date(startDate);
  startOfDay.setHours(23, 0, 0, 0);
  // Calculate the number of nights
  let nights = 0;
  let currentTimestamp = startOfDay.getTime();

  while (currentTimestamp < endTimestamp) {
    nights++;
    // Move to the next day (24 hours)
    currentTimestamp += 24 * 60 * 60 * 1000;
    // Set the time to 11 PM for the next day
    startOfDay.setTime(currentTimestamp);
    startOfDay.setHours(23, 0, 0, 0);
    currentTimestamp = startOfDay.getTime();
  }

  return nights;
}
export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  const day = String(now.getDate()).padStart(2, '0'); // Add leading zero if needed
  const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero if needed
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero if needed
  const seconds = String(now.getSeconds()).padStart(2, '0'); // Add leading zero if needed

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
export const getValidationMsg = (msg, payload) => {
  if (msg === "validation_error") {
    return payload.table_ids[0]
  }
}

export const getCurrentIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data;
  } catch (error) {
    console.error('Error fetching the IP address', error);
    return null;
  }
}

// Function to read CSV file contents as text
export const readCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();


    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

export const validateDelimiter = (contents, delimiter) => {
  const lines = contents.split(/\r\n|\n/);
  return lines[0].includes(delimiter);
};

export const csvToRowData = (arr) =>{
  const rows= arr.slice(1).filter(row => row.some(cell => cell.trim() !== "")).map((row, index) => {
    const account = {};
    arr[0].forEach((key, i) => {
      account[key] = row[i] || ""; // Assign value or empty string if undefined
    });
    return account;
  });

  return rows
}


export function getCheckedRightItems(arr) {
  return arr.filter(item => item.checked).map(item => {
    const { checked = false, ...rest } = item;
    return rest;
  });
}

export function updateCheckedStatus(event, item, side, chkBoxesControlLeft, chkBoxesControlRight) {
  return (side === 'left' ? chkBoxesControlLeft : chkBoxesControlRight).map(checkbox =>
    checkbox.value === item.value ? { ...checkbox, checked: event.target.checked } : checkbox
  );
}

export function downloadFile(url, fileName = 'exported_file.csv') {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = "_blank"
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => d?.name?.toLowerCase().includes(query));
  }
};