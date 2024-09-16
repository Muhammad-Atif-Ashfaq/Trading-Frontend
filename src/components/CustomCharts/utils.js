// import { tsvParse, csvParse } from "d3-dsv";
// import { timeParse } from "d3-time-format";
import moment from 'moment';



function parseData1(data) {
  
  // return  data.map((d) => {

    // return {
    //   date: new Date(d[0] / 1000),
    //   open: parseFloat(d[1]),
    //   high: parseFloat(d[2]),
    //   low: parseFloat(d[3]),
    //   close: parseFloat(d[4]),
    //   volume: 0.02,
    // };

  
  // });


  return  data.map((d) =>
[ 
    d[0],            // timestamp (already in milliseconds)
    parseFloat(d[1]), // open
    parseFloat(d[2]), // high
    parseFloat(d[3]), // low
    parseFloat(d[4])  // close
  ]);

  

}


 async function getBinanceData(feedFetchName, interval, date) {
  const params = {
    symbol: feedFetchName, 
    interval: interval,   
    limit:1000,
    endTime: date * 1000, 
  };
  const queryParams = new URLSearchParams(params).toString();

  const apiUrl = `https://api.binance.com/api/v3/klines?${queryParams}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return parseData1(data);
  } catch (error) {
    console.error('Error occurred during Binance data fetch:', error);
    throw error; // Re-throw error
  }
}



function parseFscApiData(data) {

  //  return Object.values(data).map(item => {
      
  //     const date = moment.unix(item.t); // Convert timestamp to Moment object
  //     const formattedDate = date.format('ddd MMM DD YYYY HH:mm:ss [GMT]Z (zzzz)'); // Format date to desired format
      



  //     return {
  //       date: new Date(item.t / 1000), // Convert timestamp to ISO string
  //       open: parseFloat(item.o), // Convert to float
  //       high: parseFloat(item.h), // Convert to float
  //       low: parseFloat(item.l), // Convert to float
  //       close: parseFloat(item.c), // Convert to float
  //       volume: parseFloat(item.v) || 0 // Convert to float, default to 0 if empty
  //     };
  //   }
  
  
  
  
  // );

 return Object.values(data).map(item =>  [ 
    item.t,            // timestamp (already in milliseconds)
    parseFloat(item.o), // open
    parseFloat(item.h), // high
    parseFloat(item.l), // low
    parseFloat(item.c)  // close
  ]
);
    
  
}

 async function getFscApiData(feedFetchName, interval, date) {


  const params = {
    symbol: feedFetchName, 
    interval: interval,   
    endTime: date * 1000, 
    limit:1000,
    access_key: import.meta.env.VITE_FSCI_ACCESS_KEY
  };
  const queryParams = new URLSearchParams(params).toString();
  const apiUrl = `https://fcsapi.com/api-v3/forex/history?${queryParams}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return parseFscApiData(data?.response);
  } catch (error) {
    console.error('Error occurred during FSC API data fetch:', error);
    throw error; // Re-throw error
  }
}


export async function getData(feedName, feedFetchName, interval, date) {
  try {
    if (isNaN(date)) {
      date = Math.floor(Date.now() / 1000); // Current time in seconds
    }

    let data;
    if (feedName === "binance") {
      data = await getBinanceData(feedFetchName, interval, date);
    } else if (feedName === "fcsapi") {
      data = await getFscApiData(feedFetchName, interval, date);
    } else {
      throw new Error('Unsupported feed name');
    }
    return data;
  } catch (error) {
    console.error('Error occurred while fetching data:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

