import React, { useState, useEffect, useCallback, useRef,useMemo,memo  } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
  BarSeries,
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
import { ema, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
  EquidistantChannel,
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

const CandleStickChartWithEquidistantChannel = memo (({ type, data: initialData, width, ratio, stopLossLevel, takeProfitLevel }) => {
  const [enableInteractiveObject, setEnableInteractiveObject] = useState(true);
  const [channels_1, setChannels_1] = useState([]);
  const [channels_3, setChannels_3] = useState([]);

  const canvasNode = useRef(null);
  const interactiveNode = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.which) {
        case 46: // DEL
          setChannels_1((prev) => prev.filter((each) => !each.selected));
          setChannels_3((prev) => prev.filter((each) => !each.selected));
          canvasNode.current.cancelDrag();
          break;
        case 27: // ESC
          interactiveNode.current.terminate();
          canvasNode.current.cancelDrag();
          setEnableInteractiveObject(false);
          break;
        case 68: // D - Draw drawing object
        case 69: // E - Enable drawing object
          setEnableInteractiveObject(true);
          break;
        default:
          console.log("Please press a valid key");
      }
    };

    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  const onDrawComplete = (channels_1) => {
    setEnableInteractiveObject(false);
    setChannels_1(channels_1);
    console.log("Draw Ends", channels_1);
  };

  const handleSelection = useCallback((interactives) => {
    const state = toObject(interactives, (each) => {
      return [`channels_${each.chartId}`, each.objects];
    });
    setChannels_1(state.channels_1 || []);
    setChannels_3(state.channels_3 || []);
    console.log("Selected Area Data", state);
  }, []);

  const saveInteractiveNode = useCallback((node) => {
    interactiveNode.current = node;
  }, []);

  const saveCanvasNode = useCallback((node) => {
    canvasNode.current = node;
  }, []);


    const { calculatedData, ema26, ema12, macdCalculator } = useMemo(() => {
      const ema26 = ema()
        .id(0)
        .options({ windowSize: 26 })
        .merge((d, c) => { d.ema26 = c; })
        .accessor((d) => d.ema26);
  
      const ema12 = ema()
        .id(1)
        .options({ windowSize: 12 })
        .merge((d, c) => { d.ema12 = c; })
        .accessor((d) => d.ema12);
  
      const macdCalculator = macd()
        .options({ fast: 12, slow: 26, signal: 9 })
        .merge((d, c) => { d.macd = c; })
        .accessor((d) => d.macd);
  
      const calculatedData = macdCalculator(ema12(ema26(initialData)));
  
      return { calculatedData, ema26, ema12, macdCalculator };
    }, [initialData]);
  
    const xScaleProvider = useMemo(() => {
      return discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date);
    }, []);

  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

  const start = useMemo(() => xAccessor(last(data)), [data]);
  const end = useMemo(() => xAccessor(data[Math.max(0, data.length - 150)]), [data]);
  const xExtents = useMemo(() => [start, end], [start, end]);

  return (
    <div style={{display:"flex",width:"100%",height:"auto"}}>
      {/* <button
        style={{ margin: "8px",marginLeft:0 }}
        disabled={!channels_1.length}
        onClick={() => {
          console.log("Deleted Selected Draw");
          setChannels_1((prev) => prev.filter((each) => !each.selected));
          setChannels_3((prev) => prev.filter((each) => !each.selected));
          canvasNode.current.cancelDrag();
        }}
      >
        Delete
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={channels_1.length || enableInteractiveObject}
        onClick={() => {
          console.log("Enabled Chart Draw");
          setEnableInteractiveObject(true);
        }}
      >
        Enable
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={!enableInteractiveObject}
        onClick={() => {
          console.log("Cancelled Chart Draw");
          setEnableInteractiveObject(false);
        }}
      >
        Cancel
      </button> */}
      <ChartCanvas
        ref={saveCanvasNode}
        height={'100%'}
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
          height={600}
          yExtents={[
            (d) => [d.high, d.low],
            ema26.accessor(),
            ema12.accessor(),
          ]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
          <YAxis axisAt="right" orient="right" ticks={5} />
          <MouseCoordinateY at="right" orient="right" displayFormat={format(".2f")} />
          <CandlestickSeries />
          <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />
          <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
          <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />
          <LineSeries yAccessor={() => stopLossLevel} stroke="red" strokeDasharray="LongDash" />
          <LineSeries yAccessor={() => takeProfitLevel} stroke="green" strokeDasharray="LongDash" />
          <OHLCTooltip origin={[-40, 0]} />
          <MovingAverageTooltip
            origin={[-38, 15]}
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
          <EquidistantChannel
            ref={saveInteractiveNode}
            enabled={enableInteractiveObject}
            onStart={() => console.log("START")}
            onComplete={onDrawComplete}
            channels={channels_1}
          />
        </Chart>
        <Chart
          id={2}
          height={150}
          yExtents={[(d) => d.volume]}
          origin={(w, h) => [0, h - 300]}
        >
          <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")} />
          <MouseCoordinateY at="left" orient="left" displayFormat={format(".4s")} />
          <BarSeries
            yAccessor={(d) => d.volume}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />
        </Chart>
        <Chart
          id={3}
          height={150}
          yExtents={macdCalculator.accessor()}
          origin={(w, h) => [0, h - 150]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" ticks={2} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat("%Y-%m-%d")} />
          <MouseCoordinateY at="right" orient="right" displayFormat={format(".2f")} />
          <MACDSeries yAccessor={(d) => d.macd} {...macdAppearance} />
          <MACDTooltip
            origin={[-38, 15]}
            yAccessor={(d) => d.macd}
            options={macdCalculator.options()}
            appearance={macdAppearance}
          />
        </Chart>
        <CrossHairCursor />
        <DrawingObjectSelector
          enabled={!enableInteractiveObject}
          getInteractiveNodes={getInteractiveNodes}
          drawingObjectMap={{ EquidistantChannel: "channels" }}
          onSelect={handleSelection}
        />
      </ChartCanvas>
    </div>
  );
});

CandleStickChartWithEquidistantChannel.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
  stopLossLevel: PropTypes.number.isRequired,
  takeProfitLevel: PropTypes.number.isRequired,
};

CandleStickChartWithEquidistantChannel.defaultProps = {
  type: "svg",
};

export default fitWidth(CandleStickChartWithEquidistantChannel);
