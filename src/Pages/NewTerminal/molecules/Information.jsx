import React,{useEffect, useState} from 'react'
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ALL_Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';

const Information = () => {

    const token = useSelector(({ terminal }) => terminal?.user?.token)
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

     const WatchMarketTradingHours = useSelector(({terminal})=>terminal?.selectedWatchMarketHours)

     const infoArray = [
      { title: 'Group', value: SelectedSymbol },
      { title: 'Name', value: name },
      { title: 'Leverage', value: selectedLeverage },
      { title: 'Lot Size', value: lot_size },
      { title: 'Lot Steps', value: lot_step },
      { title: 'Vol Minimum', value: vol_min },
      { title: 'Vol Maximum', value: vol_max },
      { title: 'Commission', value: commission },
      { title: 'Pips', value: selectedPip }
    ];


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
           
    <div className='grid grid-cols-1 gap-4 px-4 py-2  '>
    {!!WatchMarketTradingHours?.length &&  infoArray.map((information)=>(
              <div key={information.title} className='flex justify-between'>
                  <Typography sx={{fontSize:"12px",fontWeight:500}} >{information.title}</Typography>
                  <Typography sx={{fontSize:"12px"}}> {information.value}</Typography>
              </div>
    ))}
   
   <Typography sx={{fontSize:"17px",fontWeight:800}}>Time Interval</Typography>

    {WatchMarketTradingHours.map((description,index)=>(
       <div key={index} className='flex justify-between'>
          <Typography sx={{fontSize:"12px",fontWeight:500}}>{description.day}</Typography>
          <Typography sx={{fontSize:"12px"}}>{`${description.start} : ${description.end}`}</Typography>
        </div>
     ))}
    
     </div>     
  )
}

export default Information