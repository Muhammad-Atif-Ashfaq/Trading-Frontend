import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
  BarSeries,
  AreaSeries,
  CandlestickSeries,
  LineSeries,
  MACDSeries,
} from "react-stockcharts/lib/series";
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
import { ema, macd, sma } from "react-stockcharts/lib/indicator";
import {
  FibonacciRetracement,
  DrawingObjectSelector,
} from "react-stockcharts/lib/interactive";
import { fitWidth } from "react-stockcharts/lib/helper";
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

const CandleStickChartWithFibonacciInteractiveIndicator = ({
  type,
  data: initialData,
  width,
  ratio,
  stopLossLevel,
  takeProfitLevel,
}) => {
  const [chartData, setChartData] = useState(initialData);
  const [enableFib, setEnableFib] = useState(false);
  const [retracements1, setRetracements1] = useState([]);
  const [retracements3, setRetracements3] = useState([]);

  const canvasNode = useRef(null);
  const saveInteractiveNodesRef = useCallback(saveInteractiveNodes, []);
  const getInteractiveNodesRef = useCallback(getInteractiveNodes, []);

  // Define chart heights
  const chartHeights = { chart1: 400, chart2: 150, chart3: 150 };
  
  // Calculate total height for ChartCanvas
  const totalHeight = Object.values(chartHeights).reduce((a, b) => a + b, 0);

  const handleKeyPress = useCallback((e) => {
    const keyCode = e.which;
    switch (keyCode) {
      case 46: {
        // DEL
        const filteredRetracements1 = retracements1.filter(each => !each.selected);
        const filteredRetracements3 = retracements3.filter(each => !each.selected);
        if (canvasNode.current) canvasNode.current.cancelDrag();
        setRetracements1(filteredRetracements1);
        setRetracements3(filteredRetracements3);
        break;
      }
      case 27: {
        // ESC
        if (canvasNode.current) canvasNode.current.cancelDrag();
        setEnableFib(false);
        break;
      }
      case 68: // D - Draw Fib
      case 69: { // E - Enable Fib
        setEnableFib(true);
        break;
      }
      default:
        console.log('Please press a valid key');
    }
  }, [retracements1, retracements3]);

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    // Recalculate chart data whenever `initialData` changes
    const ema26 = ema()
      .id(0)
      .options({ windowSize: 26 })
      .merge((d, c) => {
        d.ema26 = c;
      })
      .accessor((d) => d.ema26);

    const ema12 = ema()
      .id(1)
      .options({ windowSize: 12 })
      .merge((d, c) => {
        d.ema12 = c;
      })
      .accessor((d) => d.ema12);

    const macdCalculator = macd()
      .options({
        fast: 12,
        slow: 26,
        signal: 9,
      })
      .merge((d, c) => {
        d.macd = c;
      })
      .accessor((d) => d.macd);

    const smaVolume50 = sma()
      .id(3)
      .options({
        windowSize: 50,
        sourcePath: "volume",
      })
      .merge((d, c) => {
        d.smaVolume50 = c;
      })
      .accessor((d) => d.smaVolume50);

    const updatedData = macdCalculator(
      smaVolume50(ema12(ema26(initialData)))
    );
    setChartData(updatedData);
  }, [initialData]);



  const xScaleProvider =  discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => d.date
  );
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(chartData);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];

  return (
    <div>
      <button
        style={{ margin: "8px" }}
        disabled={!retracements1.length && !retracements3.length}
        onClick={() => {
          console.log("Deleted Selected Draw");
          const filteredRetracements1 = retracements1.filter(each => !each.selected);
          const filteredRetracements3 = retracements3.filter(each => !each.selected);
          if (canvasNode.current) canvasNode.current.cancelDrag();
          setRetracements1(filteredRetracements1);
          setRetracements3(filteredRetracements3);
        }}
      >
        Delete
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={retracements1.length || retracements3.length || enableFib}
        onClick={() => {
          console.log("Enabled Chart Draw");
          setEnableFib(true);
        }}
      >
        Enable
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={!enableFib}
        onClick={() => {
          console.log("Cancelled Chart Draw");
          setEnableFib(false);
        }}
      >
        Cancel
      </button>

      <ChartCanvas
        ref={canvasNode}
        height={totalHeight}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
        type={type}
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
            (d) => [d.high, d.low],
            ema26.accessor(),
            ema12.accessor(),
          ]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
          />
          <YAxis axisAt="right" orient="right" ticks={5} />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <CandlestickSeries />
          <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />

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
            yAccessor={(d) => d.close}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />

          <LineSeries
            yAccessor={() => stopLossLevel}
            stroke="red"
            strokeDasharray="LongDash"
          />

          <LineSeries
            yAccessor={() => takeProfitLevel}
            stroke="green"
            strokeDasharray="LongDash"
          />
          <OHLCTooltip origin={[-40, 0]} />
          <DrawingObjectSelector
            onSelect={handleSelection}
            onComplete={(e) => {
              if (enableFib) {
                if (e.chartId === 1) {
                  onFibComplete1(e.objects);
                } else if (e.chartId === 3) {
                  onFibComplete3(e.objects);
                }
              }
            }}
          />
          {enableFib && (
            <>
              <FibonacciRetracement
                yAccessor={(d) => [d.high, d.low]}
                onComplete={(retracements) => {
                  if (retracements[0]?.chartId === 1) {
                    onFibComplete1(retracements);
                  } else if (retracements[0]?.chartId === 3) {
                    onFibComplete3(retracements);
                  }
                }}
              />
            </>
          )}
        </Chart>
        {/* Additional Chart(s) for volume and MACD or other indicators can be added here */}
      </ChartCanvas>
    </div>
  );
};

CandleStickChartWithFibonacciInteractiveIndicator.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  stopLossLevel: PropTypes.number.isRequired,
  takeProfitLevel: PropTypes.number.isRequired,
};

export default fitWidth(CandleStickChartWithFibonacciInteractiveIndicator);
