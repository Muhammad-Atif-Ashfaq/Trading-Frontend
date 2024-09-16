import React, { useEffect, useRef, useMemo } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStock from 'highcharts/modules/stock';

// Initialize Highcharts Stock module
HighchartsStock(Highcharts);

const HighChart = ({ data, liveStream }) => {
  const chartRef = useRef(null);

  // Memoize chart options to prevent re-creation
  const options = useMemo(() => ({
     xAxis: {
      overscroll: 500000,
      range: 4 * 200000,
      gridLineWidth: 1
    },
    rangeSelector: {
      buttons: [
        { type: 'minute', count: 15, text: '15m' },
        { type: 'hour', count: 1, text: '1h' },
        { type: 'all', count: 1, text: 'All' }
      ],
      selected: 1,
      inputEnabled: true
    },
    navigator: {
      series: { color: '#000000' }
    },
    series: [
      {
        type: 'candlestick',
        color: '#FF7F7F',
        upColor: '#90EE90',
        lastPrice: {
          enabled: true,
          label: { enabled: true, backgroundColor: '#FF7F7F' }
        },
        data: data // Initial data from props
      }
    ]
  }), [data]);

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (chart && liveStream) {
      const series = chart.series[0];
      const newPoints = Array.isArray(liveStream) ? liveStream : [liveStream];
      series.addPoint(newPoints, true, false);
      
      // newPoints.forEach(point => {
      //   const x = point[0];


      //   const existingPoint = series.data.find(p => p.options.x === x);

      //   if (!existingPoint) {
      //     series.addPoint(point, true, false); // Add new point, redraw chart, do not shift
      //   } else {
      //     // Update existing point
      //     existingPoint.update(point, false);
      //   }
      // });
    }
  }, [liveStream]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={options}
      ref={chartRef}
    />
  );
};

export default HighChart;
