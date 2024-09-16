import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries, LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY,
  MouseCoordinateX,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
  StandardDeviationChannel,
  DrawingObjectSelector,
} from "react-stockcharts/lib/interactive";
import { last, toObject } from "react-stockcharts/lib/utils";
import {
  saveInteractiveNodes,
  getInteractiveNodes,
} from "./interactiveutils";

const CandleStickChartWithStandardDeviationChannel = ({
  type,
  data: initialData,
  width,
  ratio,
  stopLossLevel,
  takeProfitLevel
}) => {
  const [enableInteractiveObject, setEnableInteractiveObject] = useState(true);
  const [channels_1, setChannels_1] = useState([]);
  
  const canvasNode = useRef(null);
  const interactiveNode = useRef(null);
  
  const saveInteractiveNode = useCallback((node) => {
    interactiveNode.current = node;
  }, []);

  const saveCanvasNode = useCallback((node) => {
    canvasNode.current = node;
  }, []);

  const handleSelection = useCallback((interactives) => {
    const state = toObject(interactives, (each) => [
      `channels_${each.chartId}`,
      each.objects,
    ]);
    setChannels_1(state.channels_1 || []);
  }, []);

  const onDrawComplete = useCallback((channels_1) => {
    setEnableInteractiveObject(false);
    setChannels_1(channels_1);
  }, []);

  const onKeyPress = useCallback((e) => {
    const keyCode = e.which;
    switch (keyCode) {
      case 46: { // DEL
        const newChannels = channels_1.filter(each => !each.selected);
        canvasNode.current.cancelDrag();
        setChannels_1(newChannels);
        break;
      }
      case 27: { // ESC
        interactiveNode.current.terminate();
        canvasNode.current.cancelDrag();
        setEnableInteractiveObject(false);
        break;
      }
      case 68: // D - Draw drawing object
      case 69: { // E - Enable drawing object
        setEnableInteractiveObject(true);
        break;
      }
      default:
        console.log("Please press a valid key");
    }
  }, [channels_1]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyPress);
    return () => {
      document.removeEventListener("keyup", onKeyPress);
    };
  }, [onKeyPress]);

  const xScaleProvider = useMemo(() => discontinuousTimeScaleProvider.inputDateAccessor(d => d.date));
  const { data, xScale, xAccessor, displayXAccessor } = useMemo(() => xScaleProvider(initialData), [initialData]);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];

  return (
    <div>
      {/* <button
        style={{ margin: "8px" }}
        disabled={!channels_1.length}
        onClick={() => {
          const newChannels = channels_1.filter(each => !each.selected);
          canvasNode.current.cancelDrag();
          setChannels_1(newChannels);
        }}
      >
        Delete
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={channels_1.length || enableInteractiveObject}
        onClick={() => {
          setEnableInteractiveObject(true);
        }}
      >
        Enable
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={!enableInteractiveObject}
        onClick={() => {
          setEnableInteractiveObject(false);
        }}
      >
        Cancel
      </button> */}
      <ChartCanvas
        ref={saveCanvasNode}
        height={270}
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
          height={200}
          margin={{ top: 90, }}
          yExtents={[d => [d.high, d.low]]}
          padding={{ top: 10, bottom: 20 }}
        >
          <YAxis axisAt="right" orient="right" ticks={5} />
          <XAxis axisAt="bottom" orient="bottom" />
          <MouseCoordinateY at="right" orient="right" displayFormat={format(".2f")} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat("%Y-%m-%d")} />
          <CandlestickSeries />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
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
          <StandardDeviationChannel
            ref={saveInteractiveNode}
            enabled={enableInteractiveObject}
            onStart={() => console.log("START")}
            onComplete={onDrawComplete}
            channels={channels_1}
          />
        </Chart>
        <CrossHairCursor />
        <DrawingObjectSelector
          enabled={!enableInteractiveObject}
          getInteractiveNodes={getInteractiveNodes}
          drawingObjectMap={{ StandardDeviationChannel: "channels" }}
          onSelect={handleSelection}
        />
      </ChartCanvas>
    </div>
  );
};

CandleStickChartWithStandardDeviationChannel.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
  stopLossLevel: PropTypes.number.isRequired,
  takeProfitLevel: PropTypes.number.isRequired,
};

CandleStickChartWithStandardDeviationChannel.defaultProps = {
  type: "svg",
};

export default fitWidth(CandleStickChartWithStandardDeviationChannel);
