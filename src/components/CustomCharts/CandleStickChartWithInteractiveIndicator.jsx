import React, { useState, useEffect, useRef, useCallback,useMemo,memo } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {CandlestickSeries,LineSeries} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
  OHLCTooltip,
  MovingAverageTooltip,
  MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
  TrendLine,
  DrawingObjectSelector,
} from "react-stockcharts/lib/interactive";
import { last, toObject } from "react-stockcharts/lib/utils";

import { saveInteractiveNodes, getInteractiveNodes } from "./interactiveutils";


const macdAppearance = {
  stroke: {
    macd: "#FF0000",
    signal: "#00F300",
  },
  fill: {
    divergence: "#4682B4",
  },
};

const CandlestickChart = memo((props) => {
  const { type, data: initialData, width, ratio } = props;
  const [chartHeights, setChartHeights] = useState({ chart1: 200, chart2: 250});
  const canvasNode = useRef(null);

  const [trends1, setTrends1] = useState([]);
  const [trends3, setTrends3] = useState([]);
  const [enableTrendLine, setEnableTrendLine] = useState(true);

  const node1 = useRef(null);
  const node3 = useRef(null);



  const handleSelection = useCallback((interactives) => {
    const state = toObject(interactives, each => [
      `trends_${each.chartId}`,
      each.objects,
    ]);
    setTrends1(state.trends_1 || []);
    setTrends3(state.trends_3 || []);
  }, []);

  const onDrawCompleteChart1 = useCallback((trends_1) => {
    setEnableTrendLine(false);
    setTrends1(trends_1);
  }, []);



  const onKeyPress = useCallback((e) => {
    const keyCode = e.which;
    switch (keyCode) {
      case 46: {
        const filteredTrends1 = trends1.filter(each => !each.selected);
        const filteredTrends3 = trends3.filter(each => !each.selected);

        if (canvasNode.current) {
          canvasNode.current.cancelDrag();
        }
        setTrends1(filteredTrends1);
        setTrends3(filteredTrends3);
        break;
      }
      case 27: {
        if (node1.current) node1.current.terminate();
        if (node3.current) node3.current.terminate();
        if (canvasNode.current) {
          canvasNode.current.cancelDrag();
        }
        setEnableTrendLine(false);
        break;
      }
      case 68: // D - Draw trendline
      case 69: {
        setEnableTrendLine(true);
        break;
      }
      default: {
        console.log('Please press a valid key');
      }
    }
  }, [trends1, trends3]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyPress);
    return () => {
      document.removeEventListener("keyup", onKeyPress);
    };
  }, [onKeyPress]);

  const ema26 = ema()
    .id(0)
    .options({ windowSize: 26})
    .merge((d, c) => {
      d.ema26 = c;
    })
    .accessor(d => d.ema26);

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d, c) => {
      d.ema12 = c;
    })
    .accessor(d => d.ema12);

  const macdCalculator = macd()
    .options({
      fast: 12,
      slow: 26,
      signal: 9,
    })
    .merge((d, c) => {
      d.macd = c;
    })
    .accessor(d => d.macd);

    const calculatedData = useMemo(() => {
      return macdCalculator(ema12(ema26(initialData)));
    }, [initialData ]);

  const xScaleProvider =  useMemo(() => discontinuousTimeScaleProvider.inputDateAccessor(d => d.date));
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];


  return (
    <div>
      <ChartCanvas
        ref={canvasNode}
        height={270}
        width={width}
        ratio={ratio}
        margin={{ left: 50, right: 60, top: 50, bottom: 30 }}
        type={'Candle'}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
        
      >
        <Chart
          id={1}
          height={chartHeights.chart1}
          yExtents={[
            d => [d.high, d.low],
            ema26.accessor(),
            ema12.accessor(),
          ]}
          margin={{ top: 70, }}
          padding={{ top: 20, bottom: 20 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
          />
          <YAxis axisAt="right" orient="right" ticks={5}  />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <CandlestickSeries />
          {/* <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} /> */}

          <CurrentCoordinate
            yAccessor={ema26.accessor()}
            fill={ema26.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema12.accessor()}
            fill={ema12.stroke()}
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />

          <LineSeries
            yAccessor={() => props.stopLossLevel}
            stroke="red"
            strokeDasharray="LongDash"
          />

          <LineSeries
            yAccessor={() => props.takeProfitLevel}
            stroke="green"
            strokeDasharray="LongDash"
          />

          <OHLCTooltip origin={[-40, 0]} 
          />

          <MovingAverageTooltip
            onClick={(e) => console.log(e)}
            origin={[-8, 15]}
            options={[
              {
                yAccessor: ema26.accessor(),
                type: ema26.type(),
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize,
              },
              {
                yAccessor: ema12.accessor(),
                type: ema12.type(),
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize,
              },
            ]}
          />
          <TrendLine
            ref={node1}
            enabled={enableTrendLine}
            type="RAY"
            snap={false}
            snapTo={d => [d.high, d.low]}
            onStart={() => console.log("START")}
            onComplete={onDrawCompleteChart1}
            trends={trends1}
          />
        </Chart>

       
        <CrossHairCursor />
        <DrawingObjectSelector
          enabled={!enableTrendLine}
          getInteractiveNodes={getInteractiveNodes}
          drawingObjectMap={{
            Trendline: "trends",
          }}
          onSelect={handleSelection}
        />
      </ChartCanvas>
    </div>
  );
});

CandlestickChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
  stopLossLevel: PropTypes.number.isRequired,
  takeProfitLevel: PropTypes.number.isRequired,
};

CandlestickChart.defaultProps = {
  type: "svg",
};

const CandleStickChartWithInteractiveIndicator = fitWidth(CandlestickChart);

export default CandleStickChartWithInteractiveIndicator;
