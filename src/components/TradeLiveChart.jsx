import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';


const TradeLiveChart = () => {
  useEffect(() => {
    const options = {
      title: {
        text: ''
      },
      xAxis: {
        overscroll: 500000,
        range: 4 * 200000,
        gridLineWidth: 1
      },
      rangeSelector: {
        buttons: [{
          type: 'minute',
          count: 15,
          text: '15m'
        }, {
          type: 'hour',
          count: 1,
          text: '1h'
        }, {
          type: 'all',
          count: 1,
          text: 'All'
        }],
        selected: 1,
        inputEnabled: false
      },
      navigator: {
        xAxis: {
          overscroll: 500000
        },
        series: {
          color: '#000000'
        }
      },
      series: [{
        type: 'candlestick',
        color: '#FF7F7F',
        upColor: '#90EE90',
        lastPrice: {
          enabled: true,
          label: {
            enabled: true,
            backgroundColor: '#FF7F7F'
          }
        }
      }]
    };

    const getNewPoint = (i, data) => {
      if(data){
         const lastPoint = data[data?.length - 1];
  
      if (i === 0 || i % 10 === 0) {
        return [
          lastPoint[0] + 60000,
          lastPoint[4],
          lastPoint[4],
          lastPoint[4],
          lastPoint[4]
        ];
      }
  
      const updatedLastPoint = data[data?.length - 1];
      const newClose = Highcharts.correctFloat(
        lastPoint[4] + Highcharts.correctFloat(Math.random() - 0.5, 2),
        4
      );
  
      return [
        updatedLastPoint[0],
        data[data?.length - 2][4],
        newClose >= updatedLastPoint[2] ? newClose : updatedLastPoint[2],
        newClose <= updatedLastPoint[3] ? newClose : updatedLastPoint[3],
        newClose
      ];
      }
    };
  
    options.chart = {
      events: {
        load() {
          const chart = this;
          const series = chart.series[0];
  
          let i = 0;
  
          setInterval(() => {
            const data = series?.options?.data;
            if(data){
              const newPoint = getNewPoint(i, data);
              const lastPoint = data[data?.length - 1];
    
              if (lastPoint[0] !== newPoint[0]) {
                series.addPoint(newPoint);
              } else {
                series.options.data[data?.length - 1] = newPoint;
                series.setData(data);
              }
            }
            i++;
          }, 100);
        }
      }
    };
  
    options.series[0].data = [
      [1317888000000, 372.5101, 375, 372.2, 372.52],
      // Add more data here...
    ];
  
    Highcharts.stockChart('stock-chart-container', options);

    // Clean up
    return () => {
      Highcharts.charts.forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return <div id="stock-chart-container" style={{height:"400px",width:"100%",minWidth:"200px"}}/>;
};

export default TradeLiveChart;
