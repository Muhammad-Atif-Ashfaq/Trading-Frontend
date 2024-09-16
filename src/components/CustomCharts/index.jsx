import React, { useState, useEffect, useCallback } from "react";
import DirectionsOffOutlinedIcon from '@mui/icons-material/DirectionsOffOutlined';
import CommitRoundedIcon from '@mui/icons-material/CommitRounded';
import FilterBAndWOutlinedIcon from '@mui/icons-material/FilterBAndWOutlined';
import { getData } from "./utils";
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleStickChartWithInteractiveIndicator from "./CandleStickChartWithInteractiveIndicator";
import CandleStickChartWithGannFan from "./CandleStickChartWithGannFan";
import CandleStickChartWithStandardDeviationChannel from "./CandleStickChartWithStandardDeviationChannel";
import { useSelector } from "react-redux";
import CustomLoader from "../CustomLoader";
import GraphWebSocket from "../../websockets/GraphWebSocket";
import HighChart from "./HighChart";

const ChartComponent = () => {
  const [data, setData] = useState(null);
  const [symbol, setSymbol] = useState('ETHUSDT');

  const [date, setDate] = useState(new Date().getTime() / 1000);
  const [selectedChart, setSelectedChart] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveStream,setLiveStream] = useState(null)

  const selectedWatchMarket = useSelector(({ terminal }) => terminal?.selectedWatchMarket);


  // fake data =======================
  const fakeData = [
    {
      date: new Date("2024-08-22T10:15:00.000Z"),
      open: 0.012345,
      high: 0.012500,
      low: 0.012300,
      close: 0.012400,
      volume: 1.5,
      ema26: 0.012410238475839,
      ema12: 0.012420192834578,
      macd: {
        macd: -0.000009954358739,
        signal: 0.000002574839285,
        divergence: -0.000012529198024,
      },
    },
    {
      date: new Date("2024-08-22T10:30:00.000Z"),
      open: 0.012400,
      high: 0.012600,
      low: 0.012350,
      close: 0.012550,
      volume: 2.1,
      ema26: 0.012505192837465,
      ema12: 0.012515293847285,
      macd: {
        macd: -0.000010100000000,
        signal: 0.000002800000000,
        divergence: -0.000012900000000,
      },
    },
    {
      date: new Date("2024-08-22T10:45:00.000Z"),
      open: 0.012550,
      high: 0.012700,
      low: 0.012500,
      close: 0.012680,
      volume: 3.2,
      ema26: 0.012610284738293,
      ema12: 0.012620284739204,
      macd: {
        macd: -0.000009995465000,
        signal: 0.000002794200000,
        divergence: -0.000012789665000,
      },
    },
    {
      date: new Date("2024-08-22T11:00:00.000Z"),
      open: 0.012680,
      high: 0.012900,
      low: 0.012650,
      close: 0.012850,
      volume: 4.0,
      ema26: 0.012720485639203,
      ema12: 0.012730485840192,
      macd: {
        macd: -0.000009955200000,
        signal: 0.000002754830000,
        divergence: -0.000012710030000,
      },
    }
  ];

  const trendlineData = [
    { id: 1, type: 'LineIndicator', icon: <CommitRoundedIcon />, selected: true },
    { id: 2, type: 'Deviation', icon: <DirectionsOffOutlinedIcon  />, selected: false },
    { id: 3, type: 'Fan', icon: <FilterBAndWOutlinedIcon  />, selected: false }
    // { id: 4, type: 'Fabinocci', icon: <BlurLinearOutlinedIcon fontSize="large" />, selected: false },
    // { id: 5, type: 'EquidistantChannel', icon: <WidthFullIcon  />, selected: false },
  ]


  const [trendData,setTrendData] = useState(trendlineData) 
  

  const buttonData = [
    { id:1,  time:'1m',   selected:true},
    { id:3,  time:'5m',   selected:false},
    { id:4,  time:'1h',   selected:false},
    { id:5,  time:'1d',  selected:false},
   
  ];

  const [time, setTime] = useState('1m');

  const loadData = useCallback(async() => {
    setLoading(true); 
    try {
      const feedName = selectedWatchMarket?.feed_name;
      const feedFetchName  = selectedWatchMarket?.feed_fetch_name;
      const graphData = await getData(feedName, feedFetchName, time, date);
      
      if (graphData?.length) {
        setData(graphData);
        setError(false);
      } else {
        console.warn('No data received from API');
        setError(true);
      }
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      setError(true);
    }
    finally {
      setLoading(false); // End loading
    }
    
  }, [selectedWatchMarket, time, date]);

  useEffect(() => {
    loadData(); // Load initial data
  }, [loadData,time]);

  
  const handleTimeClick = (e, btnid) => {
    console.log(btnid);
    
    const selectedTime = buttonData.find((item)=>item.id === btnid)?.time
    setTime(selectedTime);

  
  };


  const handleSymbolClick = ( symbolName) => {
    setSymbol(symbolName);
  };
  

  useEffect(()=>{

    if (selectedWatchMarket) {
    handleSymbolClick(selectedWatchMarket?.name?.toUpperCase())
    }
  },[selectedWatchMarket])

  
  const handleTrendlineClick = (e, trendid) => {
    setSelectedChart(trendid);
    const updatedTrendlineData = trendlineData.map(item => ({
      ...item,
      selected: item.id === trendid,
    }));
    
    setTrendData(updatedTrendlineData);
  }

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    console.log("Selected date:", new Date(selectedDate).getTime() / 1000);
    setDate(Math.floor(new Date(selectedDate).getTime() / 1000));
  };


  useEffect(() => {

    const graphStream = GraphWebSocket(selectedWatchMarket, true);
    const onDataReceived = (newData) => {
      if (Object.entries(newData).length) {

        // debugger
      const convertedData =  [
          new Date(newData.date).getTime(),  // Convert date string to timestamp in milliseconds
          parseFloat(newData.open),          // Open price
          parseFloat(newData.high),          // High price
          parseFloat(newData.low),           // Low price
          parseFloat(newData.close)          // Close price
      ]
        setLiveStream(convertedData)
        // setData((prevData) => {
        //   // Ensure prevData is an array
          
        //   if (Array.isArray(prevData)) {
        //     return [...prevData, newData]; 
        //   }
        //   return [newData]; // If prevData was not an array, start with newData
        // });
      }
    };

    const onError = (error) => {
      console.error('WebSocket error:', error);
    };

    const onClose = () => {
      console.log('WebSocket connection closed');
    };

    graphStream?.start(onDataReceived, onError, onClose);

    return () => {
      graphStream?.stop(() => console.log('WebSocket stopped'));
    };
  }, [selectedWatchMarket]);


  return (
    error?
    <div style={{ display: 'flex', justifyContent: 'center',alignItems:'center',height:'auto',color:"red",fontWeight:500 }}>Error Occurred during data fetching. Please Check your internet connection otherwise report it...</div>
    : 
    loading?
    <CustomLoader   color={'#6633FF'} fontSize = '50px'/>
    :
    <div className="grid grid-cols-12 gird-rows-12">

         {/* Header-Start */}
        <div className="topbar col-span-full row-span-1" style={{
          height: "auto",
          width: "100%",
          backgroundColor: "#f0f0f0",
          padding: "15px 20px"
      }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Trading Chart</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {buttonData.map(item => (
                  <button
                    key={item.id}
                    onClick={(e) => handleTimeClick(e, item.id)}
                    style={{ background: item.time === time ? '#2196F3' : 'transparent', color: item.time === time ? '#ffffff' : '#000000',
                      fontWeight:500,padding:3
                     }}
                  >
                    {item.time}
                  </button>
                ))}
              </div>
              <input type="date" id="appointment" name="appointment" onChange={handleDateChange} />

              <div style={{ display: 'flex', gap: '12px' }}>

              { selectedWatchMarket?.name?.toUpperCase()}

  
              </div>
            </div>
        </div>
         {/* Header Ends */}

         {/* Sidebar Widgets Start */}
         <div className="sidebar col-start-1 col-end-2 row-start-2" style={{
     
          width: "auto",
          backgroundColor: "#f0f0f0",
          height:"296px",
          display:"flex",
          flexDirection:"column",
          gap:8
         
        }}>
          {trendData.map(item => (
            <div 
              key={item.id}
              // className="sidebar-link"
              onClick={(e) => handleTrendlineClick(e, item.id)} 
              style={{
                  padding: "3px",
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  justifyContent:"center",
                  fontSize: "8px",
                  cursor: 'pointer',
                  color: item.selected ? "#ffffff" : '',
                  background: item.selected ? "#2196F3" : '',
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>
    {/* Sidebar Widgets End */}

         {/* Graph Start */}
        <div className="main col-start-2 col-end-12 row-start-2 ml-6" >
        
          {/* { selectedChart === 1 ? <TypeChooser>
            {(type) => (
              <CandleStickChartWithInteractiveIndicator
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3220}
                data={data}
              />
            )}
          </TypeChooser> : selectedChart === 2 ? <TypeChooser>
            {(type) => (
              <CandleStickChartWithStandardDeviationChannel
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3215}
                data={data}
              />
            )}
          </TypeChooser>  : <TypeChooser>
            {(type) => (
              <CandleStickChartWithGannFan
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3215}
                data={data}
              />
            )}
          </TypeChooser>}   */}
           <HighChart symbol={selectedWatchMarket} data={data} interval={time} liveStream = {liveStream}/> 

        </div>
        {/* Graph Ends */}
    </div>
  );
};

export default ChartComponent
