import React, { useState, useEffect, useCallback } from "react";
import Chart from "./Chart";
import BlurLinearOutlinedIcon from '@mui/icons-material/BlurLinearOutlined';
import DirectionsOffOutlinedIcon from '@mui/icons-material/DirectionsOffOutlined';
import CommitRoundedIcon from '@mui/icons-material/CommitRounded';
import FilterBAndWOutlinedIcon from '@mui/icons-material/FilterBAndWOutlined';
import WidthFullIcon from '@mui/icons-material/WidthFull';
import { getData } from "./utils";
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleStickChartWithInteractiveIndicator from "./CandleStickChartWithInteractiveIndicator";
import CandleStickChartWithGannFan from "./CandleStickChartWithGannFan";
import CandleStickChartWithStandardDeviationChannel from "./CandleStickChartWithStandardDeviationChannel";
import CandleStickChartWithFibonacciInteractiveIndicator from "./CandleStickChartWithFibonacciInteractiveIndicator";
import { useSelector } from "react-redux";
import CustomLoader from "../CustomLoader";
import { selectClasses } from "@mui/material";

const ChartComponent = () => {
  const [data, setData] = useState(null);
  const [symbol, setSymbol] = useState('ETHUSDT');

  const [date, setDate] = useState(new Date().getTime() / 1000);
  const [selectedChart, setSelectedChart] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);


  const selectedWatchMarket = useSelector(({ terminal }) => terminal?.selectedWatchMarket);

  const trendlineData = [
    { id: 1, type: 'EquidistantChannel', icon: <WidthFullIcon  />, selected: true },
    { id: 2, type: 'LineIndicator', icon: <CommitRoundedIcon />, selected: false },
    { id: 3, type: 'Deviation', icon: <DirectionsOffOutlinedIcon  />, selected: false },
    // { id: 4, type: 'Fabinocci', icon: <BlurLinearOutlinedIcon fontSize="large" />, selected: false },
    { id: 5, type: 'Fan', icon: <FilterBAndWOutlinedIcon  />, selected: false }
  ]


  const [trendData,setTrendData] = useState(trendlineData)  
  const buttonData = [
    { id:1, time: '1M',  selected:true},
    { id:2, time: '3M',  selected:false},
    { id:3, time: '5M',  selected:false},
    { id:4, time: '1H',  selected:false},
    { id:5, time: '24H', selected:false},
    { id:6, time: '48H', selected:false},
  ];

  const [time, setTime] = useState(buttonData);

  const loadData = useCallback(async() => {
    setLoading(true); 
    try {
      const feedName = selectedWatchMarket?.feed_name;
      const feedFetchName  = selectedWatchMarket?.feed_fetch_name;
      const graphData = await getData(feedName, feedFetchName, time, date);
  
      if (graphData?.length) {
        console.log('Trade data without socket', graphData[0]);
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
  }, [loadData]);

  
  const handleTimeClick = (e, btnid) => {
    console.log(btnid);
    const updatedTime = time.map(item => ({
      ...item,
      selected: item.id === btnid,
    }));
    setTime(updatedTime);

  
  };

  const handleSymbolClick = ( symbolName) => {
    // debugger
    setSymbol(symbolName);
  };

  const handleTrendlineClick = (e, trendid) => {
    setSelectedChart(trendid);
    const updatedTrendlineData = trendlineData.map(item => ({
      ...item,
      selected: item.id === trendid,
    }));
    
    setTrendData(updatedTrendlineData);
  }
  

  useEffect(()=>{

    if (selectedWatchMarket) {
    handleSymbolClick(selectedWatchMarket?.name?.toUpperCase())
    }
  },[selectedWatchMarket])
  


  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    console.log("Selected date:", new Date(selectedDate).getTime() / 1000);
    setDate(Math.floor(new Date(selectedDate).getTime() / 1000));
  };

 

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
          padding: "20px"
      }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Trading Chart</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {time.map(item => (
                  <button
                    key={item.id}
                    onClick={(e) => handleTimeClick(e, item.id)}
                    style={{ background: item.selected ? '#2196F3' : 'transparent', color: item.selected ? '#ffffff' : '#000000',
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

                {/* {symbolData.map(item => (
                  <button
                    key={item.id}
                    onClick={(e) => handleSymbolClick(e, item.id)}
                    style={{ background: item.selected ? '#478898' : 'transparent', color: item.selected ? '#ffffff' : '#000000' }}
                  >
                    {item.symbol}
                  </button>
                ))} */}
              </div>
            </div>
        </div>
         {/* Header Ends */}

        {/* Sidebar Widgets Start */}
            <div className="sidebar col-start-1 col-end-2 row-start-2 h-full" style={{
     
              width: "auto",
              backgroundColor: "#f0f0f0",
              height:"auto",
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
        <div className="main col-start-2 col-end-12 row-start-2" >
          {selectedChart === 1 ? <TypeChooser>
            {(type) => (
              <Chart
                type={type}
                stopLossLevel={3205}
                takeProfitLevel={3215}
                data={data}
              />
            )}
          </TypeChooser> : selectedChart === 2 ? <TypeChooser>
            {(type) => (
              <CandleStickChartWithInteractiveIndicator
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3220}
                data={data}
              />
            )}
          </TypeChooser> : selectedChart === 3 ? <TypeChooser>
            {(type) => (
              <CandleStickChartWithStandardDeviationChannel
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3215}
                data={data}
              />
            )}
          </TypeChooser> : selectedChart === 4 ? <TypeChooser>
            {(type) => (
              <CandleStickChartWithFibonacciInteractiveIndicator
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3215}
                data={data}
              />
            )}
          </TypeChooser> : <TypeChooser>
            {(type) => (
              <CandleStickChartWithGannFan
                type={type}
                stopLossLevel={3211}
                takeProfitLevel={3215}
                data={data}
              />
            )}
          </TypeChooser>}
        </div>
        {/* Graph Ends */}
    </div>
  );
};

export default ChartComponent
