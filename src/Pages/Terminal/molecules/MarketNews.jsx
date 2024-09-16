import React,{useEffect} from 'react'
import { Stack,Typography } from '@mui/material'
import { useParams } from 'react-router-dom';


const MarketNews = () => {
  
  const {brand_id } = useParams()

    useEffect(() => {
    const container = document.getElementById('tradingview-widget-container__widget');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "isTransparent": false,
      "displayMode": "regular",
      "width": 250,
      "height": 550,
      "colorTheme": "light",
      "locale": "en"
    });

    container.appendChild(script);

    return () => {
      const widget = document.querySelector('.tradingview-widget');
      if (widget) {
        widget.remove();
      }
    };
  }, []);

  return (
    <Stack sx={{p:2,backgroundColor:"#fff",gap:4}}>
    <Typography sx={{fontWeight:600,fontSize:"18px"}}>MarketNews</Typography>
    <div className="tradingview-widget-container">
        <div id="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget"></div>
        <div className="tradingview-widget-copyright">
          
        </div>
      </div>
    </Stack>

  )
}

export default MarketNews

