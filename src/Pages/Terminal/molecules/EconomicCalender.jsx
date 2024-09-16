import React ,{useEffect}from 'react'
import { Stack,Typography } from '@mui/material'
import { useParams } from 'react-router-dom';


const EconomicCalender = () => {
    const {brand_id } = useParams()
   useEffect(() => {

    const container = document.getElementById('tradingview-widget-container__widget');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "light",
      "isTransparent": false,
      "width": "250",
      "height": "550",
      "locale": "en",
      "importanceFilter": "-1,0,1",
      "countryFilter": "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu"
    });
    
    container.appendChild(script);

  return () => {
     const widget = document.querySelector('.tradingview-widget-copyright');
      if (widget) {
        widget.remove();
      }
    };

  }, []);


  return (
    <Stack  sx={{p:2,backgroundColor:"#fff"}}>
       
        <div className="tradingview-widget-container">
          <div id="tradingview-widget-container__widget"></div>
          <div className="tradingview-widget-copyright">
          </div>
        </div>

        </Stack>
  )
}

export default EconomicCalender



