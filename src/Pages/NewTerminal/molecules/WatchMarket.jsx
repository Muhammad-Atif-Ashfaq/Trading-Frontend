
import { Box,Skeleton,Stack,Typography,Autocomplete,TextField,IconButton,InputAdornment  } from '@mui/material'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { GetTerminalSymbolsList } from '../../../utils/_Terminal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedWatchMarket,setSelectedWatchMarketHours,setSelectedTerminalSymbolIndex, setSelectedTerminalSymbolSettingIndex, setSymbolGroups } from '../../../store/terminalSlice';
import { useParams } from 'react-router-dom';
import WatchMarketAskBidPricing from './WatchMarketAskBidPricing';
import { filterData } from '../../../utils/helpers';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import CustomModal from '../../../components/CustomModal';
import BuySellModal from './BuySellModal';
import WatchMarketAskBidPricingButton from './WatchMarketAskBidPricingButton';
// import SearchBar from '../../../components/SearchBar';



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
   const token = useSelector(({ terminal }) => terminal?.user?.token)

  const selectedTerminalSymbolSettingIndex = useSelector(({terminal})=>terminal?.selectedTerminalSymbolSettingIndex)
  const selectedWatchMarket= useSelector(({terminal})=>terminal?.selectedWatchMarket)
  const symbolGroups = useSelector(({terminal})=>terminal?.symbolGroups)
  const allGroups = [{id:'all',name:"All"},...symbolGroups ]
  const [symbolsSettings,setSymbolsSettings] = React.useState([])
  const [searchField,setSearchField] = React.useState(false)

  const [expanded, setExpanded] = React.useState('panel1');
  const [searchQuery, setSearchQuery] = React.useState("");
  // const  dataFiltered = filterData(searchQuery, symbolGroups);
  const [selectedSymbolGroup,setSelectedSymbolGroup ] = React.useState(null) 
    
  const handleChange = (panel,setting) => (event, newExpanded) => {
   
    const parsedObject = JSON.parse(setting?.group?.trading_interval)
        const datesArray = Object.keys(parsedObject).map(day => ({
      day,
      ...parsedObject[day]  
    }));
    dispatch(setSelectedWatchMarketHours(datesArray))
    
    dispatch(setSelectedWatchMarket(setting))
    setExpanded(newExpanded ? panel : false);

  };




  const fetchTerminalSymbols = async () => {
    try {
      const res = await GetTerminalSymbolsList(token);
      const { data: { message, success, payload } } = res   
            
          dispatch(setSymbolGroups(payload)) 

        let allSettings = payload?.reduce((acc, group) => {
        acc.push(...group?.settings);
        return acc;
      }, []);

      setSymbolsSettings(allSettings)
           

    
    } catch (error) {
      console.error('Error fetching terminal symbol groups:', error);
    }
  }

  const searchSymbol = (e)=> {

             const searchTerm = e.target.value.toLowerCase();
              if (searchTerm === '') {
              setSymbolsSettings(symbolsSettings);
              return;
          }

              // Separate searched and non-searched items
              const searchedItems = symbolsSettings.filter(symbol =>
                symbol?.name.toLowerCase().includes(searchTerm)
              );
              const nonSearchedItems = symbolsSettings.filter(symbol =>
                !symbol?.name.toLowerCase().includes(searchTerm)
              );

              // Sort searched items based on relevance (optional)
              // You can add custom sorting logic here if needed

              // Combine searched items (sorted or not) with non-searched items
              const updatedSymbolsSettings = [...searchedItems, ...nonSearchedItems];

              // Update state with the updated array
              setSymbolsSettings(updatedSymbolsSettings);
        
  }



  React.useEffect(() => {
    fetchTerminalSymbols()
  }, [])


  return (

      <Stack sx={{width:"100%",boxSizing:"border-box",gap:4,maxHeight:"calc(100vh - 100px)",overflowY:"auto",py:3 }}>
      {/* <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} data={symbolGroups} /> */}
     

      <div className="flex items-center justify-center">
       {searchField ? 
       (<TextField
          placeholder="Search Symbol" 
          sx={{
            width: '100%',
            px:1,
          borderRadius:"30px"
         }}
         onChange={(e) =>searchSymbol(e)}
          InputProps={{
            endAdornment: (
             <InputAdornment position="start">
              <IconButton aria-label="search" onClick={()=>setSearchField(false)}>
                <ClearIcon />
              </IconButton>
             </InputAdornment>
       
          ),
        }}
        />):
       ( <Autocomplete
          id="country-customized-option-demo"
          options={allGroups}
         
          disableCloseOnSelect
          getOptionLabel={(option) =>option?.name} 
          value={selectedSymbolGroup}
          onChange={(e, value) => {
            if(value?.id === 'all'){
                let allSettings = symbolGroups?.reduce((acc, group) => {
                acc.push(...group?.settings);
                return acc;
              }, []);

            setSymbolsSettings(allSettings)
            setSelectedSymbolGroup(value)
            }else{
             const selectedGroup = symbolGroups?.find((group)=>group?.id === value?.id);
              setSymbolsSettings(selectedGroup?.settings)
             setSelectedSymbolGroup(value)
            }
          }} 
          renderInput={(params) => <TextField {...params} 
          InputProps={{
             ...params.InputProps,
            startAdornment: (
             <InputAdornment position="start">
              <IconButton aria-label="search" onClick={()=>setSearchField(true)}>
                <SearchIcon />
              </IconButton>
             </InputAdornment>
          ),
        }}
          sx={{ 
            '& .MuiInputBase-root': {
              padding: '-8px', // Adjust the padding as needed
            }
          }} 
          placeholder={"Select Symbol Group"}
          />
        }
          sx={{
          width: '100%',
          px:1,
          borderRadius:"30px"
        }}
        />)
        }

      </div>

      <Stack>
           

        { symbolsSettings?.length ? (
        <Stack sx={{alignItems:"center",justifyContent:"center",px:1,gap:2}}>
          {symbolsSettings?.map((setting,settingsIndex)=>(
             
          <Accordion sx={{width:"100%"}} key={setting.id} expanded={selectedWatchMarket?.name === setting?.name}  onChange={handleChange(`panel${settingsIndex+1}`,setting)} >
          <AccordionSummary aria-controls={`panel${settingsIndex+1}d-content`} id={`panel${settingsIndex+1}d-header`} >
            <Stack direction="row" sx={{width:"100%",justifyContent:"space-between"}}>
              <Typography>{setting?.name} </Typography>
              {/* <WatchMarketAskBidPricing symbol = {setting} pip = {setting?.pip} /> */}

            </Stack>
            
          </AccordionSummary>
          <AccordionDetails sx={{px:0}}>
            <Stack alignItems={'center'} justifyContent="center" gap={2}>
           
            <WatchMarketAskBidPricingButton  symbol = {setting} pip = {setting?.pip} />
              
          </Stack>
              
            
          </AccordionDetails>
        </Accordion>
          ))}
         
        </Stack> 
          
      ):
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



