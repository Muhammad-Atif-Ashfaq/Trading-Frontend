
import { Box, IconButton, Skeleton, Stack,Typography } from '@mui/material'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import PlusIcon from '../../../assets/images/plus-icon.svg'
import QuestionIcon from '../../../assets/images/question-icon.svg'
import { GetTerminalSymbolsList } from '../../../utils/_Terminal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedWatchMarket,setSelectedWatchMarketHours,setSelectedTerminalSymbolIndex, setSelectedTerminalSymbolSettingIndex } from '../../../store/terminalSlice';
import { useParams } from 'react-router-dom';
import WatchMarketAskBidPricing from './WatchMarketAskBidPricing';
import { Spin } from 'antd';
import CustomModal from '../../../components/CustomModal';
import BuySellModal from './BuySellModal';


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));


const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : '#00000012',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
    border:'none'
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const WatchMarket = () => {
  
   const {brand_id,domain } = useParams()
   const dispatch = useDispatch()
   const [expanded, setExpanded] = React.useState('panel1');
   const [terminalSymbols,setTerminalSymbols] =  React.useState([])
  const token = useSelector(({ terminal }) => terminal?.user?.token)


  const selectedTerminalSymbolIndex = useSelector(({terminal})=>terminal?.selectedTerminalSymbolIndex)
  const selectedTerminalSymbolSettingIndex = useSelector(({terminal})=>terminal?.selectedTerminalSymbolSettingIndex)

    

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleClick = (setting,index,subIndex)=>{

  
    dispatch(setSelectedTerminalSymbolIndex(index))
    dispatch(setSelectedTerminalSymbolSettingIndex(subIndex))
    dispatch(setSelectedWatchMarket(setting))
    const parsedObject = JSON.parse(setting?.group?.trading_interval)
        const datesArray = Object.keys(parsedObject).map(day => ({
      day,
      ...parsedObject[day]
}));

    dispatch(setSelectedWatchMarketHours(datesArray))
  }

  const fetchTerminalSymbols = async () => {
    try {
      const res = await GetTerminalSymbolsList(token);
      const { data: { message, success, payload } } = res
        // setTerminalSymbols(payload)
        // Fetch groups and settings one by one with a delay
    payload.forEach((group, groupIndex) => {
      setTimeout(async () => {
        // Update group details
        await new Promise(resolve => {
          setTerminalSymbols(currentTerminals => {
            const updatedTerminals = [...currentTerminals];
            updatedTerminals[groupIndex] = { ...updatedTerminals[groupIndex], ...group };
            return updatedTerminals;
          });
          resolve();
        });

        // Fetch settings for the current group
        group.settings.forEach((setting, settingIndex) => {
          setTimeout(async () => {
            // Update settings for the current group
            await new Promise(resolve => {
              setTerminalSymbols(currentTerminals => {
                const updatedTerminals = [...currentTerminals];
                updatedTerminals[groupIndex].settings[settingIndex] = { ...updatedTerminals[groupIndex].settings[settingIndex], ...setting };
                return updatedTerminals;
              });
              resolve();
            });
          }, groupIndex * settingIndex * 20000); // Delay each setting fetch by 5 seconds (5000 milliseconds)
        });

      }, groupIndex *  2000); // Delay each group fetch by 5 seconds (5000 milliseconds)
    });
   
    } catch (error) {
      console.error('Error fetching terminal symbol groups:', error);
    }
  }

 

 

  React.useEffect(() => {
    fetchTerminalSymbols()
  }, [])


  return (

      <Stack sx={{width:"100%",boxSizing:"border-box",gap:4}}>
      <Typography sx={{fontWeight:600,fontSize:"18px" ,p:3}}>Market Watch</Typography>

      <Stack sx={{px:1.5}}>
          { 
          !!terminalSymbols?.length ?  terminalSymbols?.map((terminal,index)=>(
          
        <Accordion key={terminal.id} expanded={expanded === `panel${index+1}`}  onChange={handleChange(`panel${index+1}`)} >
          <AccordionSummary aria-controls={`panel${index+1}d-content`} id={`panel${index+1}d-header`} >
            <Stack direction="row" sx={{width:"100%",justifyContent:"space-between"}}>
              <Typography>{terminal?.name} </Typography>
              <Typography pr={1}>{terminal?.settings?.length}</Typography>

            </Stack>
            
          </AccordionSummary>
          <AccordionDetails sx={{px:0}}>
            <Stack alignItems={'center'} justifyContent="center" gap={2}>
            {terminal?.settings?.map((setting,subIndex)=>(
              <Stack key={setting.id} onClick={()=>handleClick(setting,index,subIndex)} direction="row" alignItems={'center'} justifyContent="center" gap={0.8} sx={{cursor:"pointer",backgroundColor:selectedTerminalSymbolIndex === index && selectedTerminalSymbolSettingIndex ===  subIndex ? '#e2e2e2': 'transparent',px:1.5,py:0.7, borderRadius:2}}>
                  <Typography  sx={{p:0,color:"#6E7499",fontSize:"10px"}}>
                  {setting?.name}
                </Typography>
                  <WatchMarketAskBidPricing symbol = {setting} pip = {setting?.pip} />
              </Stack>
            ))}
          </Stack>
              
            
          </AccordionDetails>
        </Accordion>)):
       ( 
         <Box sx={{ width: '100%' }}>
          <Skeleton p={1.5}  />
          <Skeleton animation="wave" p={1.5} />
          <Skeleton animation="wave" p={1.5} />
          <Skeleton animation="wave" p={1.5} />
          <Skeleton animation="wave"  p={1.5}/>
          <Skeleton animation="wave" p={1.5} />
        </Box>
      )}
        
        
      </Stack>

      </Stack>
  )
}

export default WatchMarket



