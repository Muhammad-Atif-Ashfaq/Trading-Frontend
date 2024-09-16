import React,{useEffect, useState} from 'react'
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';
import { LeverageList,PipsValues } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { ALL_Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';
import { TextFields } from '@mui/icons-material';

const Information = () => {

    const token = useSelector(({ terminal }) => terminal?.user?.token)
    const [errors, setErrors] = useState({});
    const [selectedLeverage,setSelectedLeverage] = useState(null)
    const selectedWatchMarket = useSelector((state)=> state?.terminal?.selectedWatchMarket)
    const [SelectedSymbol, setSelectedSymbol] = useState(null)
    const [name,setName] = useState('')
    const [lot_size,setLot_size] =  useState('')
    const [lot_step,setLot_step] =  useState('')
    const [vol_min,setVol_min] =  useState('')
    const [vol_max,setVol_max] =  useState('')
    const [commission,setCommission] = useState('')

    const [selectedPip,setSelectedPip] = useState(null)

    const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)

    const setSelectedFields=async()=>{

      try {
      const res = await ALL_Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      const selectedGroup = payload?.find(x => x?.id === selectedWatchMarket.symbel_group_id)
      setSelectedSymbol(selectedGroup.name)


    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }


          setSelectedLeverage(selectedWatchMarket?.leverage)
          setName(selectedWatchMarket?.name)
          setLot_size(selectedWatchMarket?.lot_size)
          setLot_step(selectedWatchMarket?.lot_step)
          setVol_min(selectedWatchMarket?.vol_min)
          setVol_max(selectedWatchMarket?.vol_max)
          setCommission(selectedWatchMarket?.commission)
          setSelectedPip(selectedWatchMarket?.pip)
          setSelectedFeedNameFetch(selectedWatchMarket?.feed_fetch_name)
    }

    useEffect(()=>{
        setSelectedFields()   
    },[selectedWatchMarket])


  return (
           
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
    <div>
      <TextField
        label="Group"
        variant="standard"
        fullWidth
        value={SelectedSymbol}
        disabled={true}
      />
    </div>
    <div>
      <TextField
          fullWidth
        label="Name"
        variant="standard"
        value={name}
        disabled={true}
      />
      

    </div>
    <div>
      <TextField
     
        label="Feed Name"
        variant="standard"
        fullWidth
        value={selectedFeedNameFetch}
        disabled={true}

      />
    </div>
    <div>
      <TextField
      
        variant="standard"
        fullWidth
        value = {selectedLeverage}
        disabled={true}
        label='Leverage'
      
      />
    </div>
  

    <div>
      <TextField
        
        label="Lot Size"  
        variant="standard"
        value={lot_size}
        disabled={true}
        fullWidth

      />
      
    </div>
    <div>
      <TextField
        label="Lot Steps"
        value={lot_step}
        disabled={true}
        variant="standard"
        fullWidth

      />
      
    </div>

    <div>
      <TextField
         fullWidth
        label="Vol Minimum"
        value={vol_min}
        disabled={true}
        variant="standard"
      />
     
    </div>
    <div>
      <TextField
        label="Vol Maximum"
        value={vol_max}
        disabled={true}
        variant="standard"
        fullWidth

      />
      
    </div>

    <div>
      <TextField
        label="Commision"
        value={commission}
        variant="standard"
       disabled={true}
       fullWidth


      />
    </div>
  

      <div>
      <TextField
        label="Pips"
        variant="standard"
        disabled={true}
        value={selectedPip}
        fullWidth
      />
    </div>   



     </div>     
  )
}

export default Information