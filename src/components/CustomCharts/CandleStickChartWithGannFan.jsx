import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
  CandlestickSeries,
  LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY,
  MouseCoordinateX,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
  OHLCTooltip,
} from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { GannFan, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import { last, toObject } from "react-stockcharts/lib/utils";
import { saveInteractiveNodes, getInteractiveNodes } from "./interactiveutils";

const CandleStickChartWithGannFan = (props) => {
  const { type, data: initialData, width, ratio } = props;
  const [enableInteractiveObject, setEnableInteractiveObject] = useState(true);
  const [fans, setFans] = useState([]);
  const canvasNode = useRef(null);
  const gannFanNode = useRef(null);
  

  const handleSelection = useCallback((interactives) => {
    const state = toObject(interactives, each => [
      "fans",
      each.objects,
    ]);
    setFans(state.fans || []);
  }, []);

  const onDrawComplete = useCallback((fans) => {
    setEnableInteractiveObject(false);
    setFans(fans);
  }, []);

  const onKeyPress = useCallback((e) => {
    const keyCode = e.which;
    console.log(keyCode);
    switch (keyCode) {
      case 46: { // DEL
        const updatedFans = fans.filter(each => !each.selected);
        if (canvasNode.current) {
          canvasNode.current.cancelDrag();
        }
        setFans(updatedFans);
        break;
      }
      case 27: { // ESC
        if (gannFanNode.current) {
          gannFanNode.current.terminate();
        }
        if (canvasNode.current) {
          canvasNode.current.cancelDrag();
        }
        setEnableInteractiveObject(false);
        break;
      }
      case 68: // D - Draw drawing object
      case 69: { // E - Enable drawing object
        setEnableInteractiveObject(true);
        break;
      }
      default: {
        console.log('Please press a valid key');
      }
    }
  }, [fans]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyPress);
    return () => {
      document.removeEventListener("keyup", onKeyPress);
    };
  }, [onKeyPress]);

  const saveCanvasNode = useCallback(node => {
    canvasNode.current = node;
  }, []);

  const saveInteractiveNode = useCallback(node => {
    gannFanNode.current = node;
  }, []);

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];

  return (
    <div>
      {/* <button
        style={{ margin: "8px" }}
        disabled={!fans.length}
        onClick={() => {
          console.log("Deleted Selected Draw");
          const updatedFans = fans.filter(each => !each.selected);
          if (canvasNode.current) {
            canvasNode.current.cancelDrag();
          }
          setFans(updatedFans);
        }}
      >
        Delete
      </button>
      <button
        style={{ margin: "8px" }}
        disabled={fans.length || enableInteractiveObject}
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
          yExtents={[d => [d.high, d.low]]}
          margin={{ top: 90, }}
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
            fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
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
          <OHLCTooltip origin={[-40, 0]} />
          <GannFan
            ref={saveInteractiveNode}
            enabled={enableInteractiveObject}
            onStart={() => console.log("START")}
            onComplete={onDrawComplete}
            fans={fans}
          />
        </Chart>
        <CrossHairCursor />
        <DrawingObjectSelector
          enabled={!enableInteractiveObject}
          getInteractiveNodes={getInteractiveNodes}
          drawingObjectMap={{
            GannFan: "fans",
          }}
          onSelect={handleSelection}
        />
      </ChartCanvas>
    </div>
  );
};

CandleStickChartWithGannFan.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
  stopLossLevel: PropTypes.number.isRequired,
  takeProfitLevel: PropTypes.number.isRequired,
};

CandleStickChartWithGannFan.defaultProps = {
  type: "svg",
};

export default fitWidth(CandleStickChartWithGannFan);
