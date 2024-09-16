import { Box } from '@mui/material';
import React, { useEffect, useRef, memo } from 'react';
import { Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const TradeChart = () => {
  const container = useRef();
  const selectedWatchMarket = useSelector(({ terminal }) => terminal?.selectedWatchMarket);

  useEffect(
    () => {
      if (container.current) {
        // Clear the previous chart
        container.current.innerHTML = '';

        // Create a new script element
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
          {
            "width": "700",
            "height": "350",
            "symbol": "${selectedWatchMarket?.name?.toUpperCase() ?? ''}",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "withdateranges": true,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "details": true,
            "hotlist": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
          }`;
        // Append the new script to the container
        container.current.appendChild(script);
      }
    },
    [selectedWatchMarket] // Dependency array to trigger useEffect when selectedWatchMarket changes
  );

  return (
    <Stack sx={{ direction: "column" }}>
      <Box sx={{ display: "flex", width: '100%' }}>
        <div className="tradingview-widget-container" ref={container}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </Box>
    </Stack>
  );
}

export default memo(TradeChart);
