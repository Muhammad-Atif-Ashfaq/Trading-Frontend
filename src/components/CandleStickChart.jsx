import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const CandleStickChart = ({ symbol, connected, pricing, interval = "1m", setLoading }) => {
  const [ohlcData, setOhlcData] = useState([]);
  const tickInterval = getTickInterval(interval);

  const fetchData = async (isUpdate = false) => {
    try {
      setLoading(true);
      let response;

      if (symbol?.feed_name === 'binance') {
        response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: symbol?.feed_fetch_name,
            interval: interval,
            limit: isUpdate ? 1 : 500,
          }
        });

        const data = response.data;
        const ohlcList = data.map(item => [
          item[0], 
          parseFloat(item[1]), 
          parseFloat(item[2]),  
          parseFloat(item[3]),  
          parseFloat(item[4]),  
        ]);

        if (isUpdate) {
          setOhlcData(prevOhlcData => {
            const updatedData = [...prevOhlcData, ...ohlcList];
            if (updatedData.length > 500) {
              updatedData.shift();
            }
            return updatedData;
          });
        } else {
          setOhlcData(ohlcList);
        }
      } else if (symbol?.feed_name === 'fcsapi') {
        response = await axios.get(`https://fcsapi.com/api-v3/${symbol?.feed_fetch_key}/history`, {
          params: {
            symbol: symbol?.feed_fetch_name,
            period: interval,
            access_key: symbol?.data_feed?.feed_login,
          }
        });
        const data = response?.data?.response;
        const dataArray = Object.values(data);

        const ohlcList = dataArray.map(item => [
          new Date(item.tm).getTime(),  
          parseFloat(item.o),  
          parseFloat(item.h),  
          parseFloat(item.l),  
          parseFloat(item.c), 
        ]);

        setLoading(false);

        if (isUpdate) {
          setOhlcData(prevOhlcData => {
            const updatedData = [...prevOhlcData, ...ohlcList];
            if (updatedData.length > 500) {
              updatedData.shift();
            }
            return updatedData;
          });
        } else {
          setOhlcData(ohlcList);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol, interval]);

  useEffect(() => {
    if (pricing) {
      fetchData(true);
    }
  }, [pricing]);

  const options = {
    title: {
      text: 'Candlestick Chart'
    },
    series: [
      {
        type: 'candlestick',
        name: symbol?.feed_name,
        data: ohlcData,
      }
    ],
    xAxis: {
      type: 'datetime',
      tickInterval: tickInterval
    },
    yAxis: {
      title: {
        text: 'Price'
      }
    },
    rangeSelector: {
      enabled: false
    },
    navigator: {
      enabled: false
    },
  };

  return <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />;
};

const getTickInterval = (interval) => {
  switch (interval) {
    case "1m":
      return 60 * 1000;
    case "5m":
      return 5 * 60 * 1000;
    case "30m":
      return 30 * 60 * 1000;
    case "60m":
      return 60 * 60 * 1000;
    default:
      return undefined;
  }
};

export default CandleStickChart;
