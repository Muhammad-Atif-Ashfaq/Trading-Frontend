import { Box,Typography,Stack } from "@mui/material"
import { useSelector } from "react-redux"


const TradingHours = () => {
  const WatchMarketTradingHours = useSelector(({terminal})=>terminal?.selectedWatchMarketHours)


  return (
    <Box sx={{display:"flex",flexDirection:"column",  flexGrow:1,gap:2}}>

        <Typography sx={{fontSize:'20px',fontWeight:600}}>Trading Hours</Typography>
           
                {WatchMarketTradingHours.map((description,index)=>(
                <Stack key={index} direction="row" justifyContent={"space-between"} sx={{width:'60%',borderBottom:"1px solid #00000026", pb:0.5}}>
                    <Typography sx={{fontSize:"16px",color:"#848E9C"}}>{description.day}</Typography>
                    <Typography sx={{fontSize:"16px",fontWeight:600}}>{`${description.start} : ${description.end}`}</Typography>
                </Stack>
                ))}
                
              
        </Box>
  )
}

export default TradingHours