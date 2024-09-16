// TradingViewChart.jsx
import { useEffect, useRef } from "react";

// eslint-disable-next-line react-refresh/only-export-components
function TradingViewChart() {
  const container = useRef();

  useEffect(() => {
    const scriptId = "tradingview-widget-script";
    if (document.getElementById(scriptId)) {
      // If script already exists, do nothing
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "width": "1300",
          "height": "600",
          "symbol": "IBM",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.appendChild(script);
    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default TradingViewChart;
