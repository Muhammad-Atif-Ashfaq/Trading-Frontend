import { Spin, theme,Dropdown } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { LeftOutlined, RightOutlined, EllipsisOutlined, EditOutlined,CaretDownOutlined } from '@ant-design/icons';
import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import {LeverageList} from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import {SaveSymbolGroups, SelectSymbolWRTID, UpdateSymbolGroups} from '../../../utils/_SymbolGroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import { GenericEdit,GenericDelete } from '../../../utils/_APICalls';
import CustomNotification from '../../../components/CustomNotification';
import { CustomBulkDeleteHandler } from '../../../utils/helpers';
import { deleteSymbolGroupById, setSymbolGroupsData, setSymbolGroupsSelectedIDs, updateSymbolGroups } from '../../../store/symbolGroupsSlice';
import CustomDateRangePicker from '../../../components/CustomDateRange';
import { updateSymbolSettings } from '../../../store/symbolSettingsSlice';
import TimePicker from '../../../components/TimePicker';
import { FetchData } from '../../../utils/FetchData';
import { All_Setting_Data, Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';
const SymbolGroupEntry = () => {
  const isCompleteSelect = localStorage.getItem("isCompleteSelect")
  const page = localStorage.getItem("page");

  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary  },
  } = theme.useToken();
  const token = useSelector(({user})=> user?.user?.token )
  const navigate = useNavigate()
  const dispatch  = useDispatch()
  const [symbolGroupName, setSymbolGroupName] = useState('')
  const [SelectedLeverage, setSelectedLeverage] = useState(null)
  const [Swap, setSwap] = useState('')
  const [LotSize, setLotSize] = useState('')
  const [LotStep, setLotStep] = useState('')
  const [VolMin, setVolMin] = useState('')
  
  const [VolMax, setVolMax] = useState('')
  // const [TradingInterval, setTradingInterval] = useState('')
  // const [trading_interval_start_time, setTradingIntervalStartTime] = useState('')
  // const [trading_interval_end_time, setTradingIntervalEndTime] = useState('')
  const [trading_time, setTradingTime] = useState({
    Monday: { start: '00:00', end: '00:00' },
    Tuesday: { start: '00:00', end: '00:00' },
    Wednesday: { start: '00:00', end: '00:00' },
    Thursday: { start: '00:00', end: '00:00' },
    Friday: { start: '00:00', end: '00:00' },
    Saturday: { start: '00:00', end: '00:00' },
    Sunday: { start: '00:00', end: '00:00' },
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showPicker, setShowPicker] = useState(false);

  

   const SymbolGroupsIds = useSelector(({ symbolGroups }) => symbolGroups.selectedRowsIds)
    const SymbolGroupsData = useSelector(({symbolGroups})=> symbolGroups.symbolGroupsData)
   const ArrangedSymbolGroupsData = SymbolGroupsData;
   const fetchAllSetting = async (page) => {
    try {
      const res = await Symbol_Group_List(token, page, 10);
      const { data: { message, success, payload } } = res
      dispatch(setSymbolGroupsData(payload.data))
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const validationSchema = Yup.object().shape({
      symbolGroupName: Yup.string().required('Name is required'),
      Leverage: Yup.object().required('Leverage is required'),
      Swap: Yup.string().required('Swap is required'),
      LotSize: Yup.string().required('Lot Size is required'),
      LotStep: Yup.string().required('Lot Step is required'),
      VolMin: Yup.string().required('Vol Min is required'),
      VolMax: Yup.string().required('Vol Max is required'),
      // TradingInterval: Yup.string().required('Trading Interval is required'),
  });
  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'symbolGroupName':
        setSymbolGroupName(value);
        break;
      case 'Swap':
        setSwap(value);
        break;
      case 'LotSize':
        setLotSize(value);
        break;
      case 'LotStep':
        setLotStep(value);
        break;
      case 'VolMin':
        setVolMin(value);
        break;
      case 'VolMax':
        setVolMax(value);
        break;
      // case 'TradingInterval':
      //   setTradingInterval(value);
      //   break;
      default:
        break;
    }
  };

  const handleSave = (data) => {
    // Do something with the data, such as sending it to the server
    console.log('Saved data:', data);
    setTradingTime(data);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const clearFields = () =>{
    setSymbolGroupName('');
    setSelectedLeverage(null)
    setSwap('');
    setLotSize('');
    setLotStep('');
    setVolMin('');
    setVolMax('');
    // setTradingInterval('')
    // setTradingIntervalStartTime("")
    // setTradingIntervalEndTime("")
    setTradingTime({
          Monday: { start: '00:00', end: '00:00' },
          Tuesday: { start: '00:00', end: '00:00' },
          Wednesday: { start: '00:00', end: '00:00' },
          Thursday: { start: '00:00', end: '00:00' },
          Friday: { start: '00:00', end: '00:00' },
          Saturday: { start: '00:00', end: '00:00' },
          Sunday: { start: '00:00', end: '00:00' },
        })
  }
  //#region HandleSubmit

  const handleSubmit = async()=> {
    
    try{
   
    
      const SymbolGroupData = {
        name : symbolGroupName || "",
        leverage: SelectedLeverage?.value|| null,
        lot_size: LotSize|| "",
        lot_step: LotStep|| "",
        vol_min: VolMin|| "",
        vol_max: VolMax|| "",
        // trading_interval: TradingInterval,
        trading_interval: JSON.stringify(trading_time)||null,
        // trading_interval_start_time: trading_interval_start_time,
        // trading_interval_end_time: trading_interval_end_time,
        swap: Swap||""
      }
      if(SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) === 0 || SymbolGroupsIds[0] === undefined){
       setIsLoading(true)
          await validationSchema.validate({
        symbolGroupName,
        Leverage : SelectedLeverage,
        Swap,
        LotSize,
        LotStep,
        VolMin,
        VolMax,
        // TradingInterval
      }, { abortEarly: false });

      setErrors({});
       const res = await SaveSymbolGroups(SymbolGroupData, token)
       const {data: {message, payload, success}} = res
       fetchAllSetting(page)
       dispatch(setSymbolGroupsSelectedIDs([payload?.id]))
       setIsLoading(false)
       if(success){
          CustomNotification({
            type: 'success',
            title: 'success',
            description: message,
            key: 2
          })
        clearFields()
        window.location.reload();

        // navigate('/symbol-groups')
      }else{
      setIsLoading(false)
      CustomNotification({
            type: 'error',
            title: 'error',
            description: message,
            key: 2
          })
      }
      }
      else {
        setIsLoading(true)
        const Params = {
         table_name: 'symbel_groups',
         table_ids: isCompleteSelect === "true" ? [] : SymbolGroupsIds,
         ...SymbolGroupData
       }
       
       const res = await GenericEdit(Params, token)
       const { data: { message, success, payload } } = res;
       if (success)
       {
         dispatch(updateSymbolGroups(payload))
         localStorage.setItem('isCompleteSelect', JSON.stringify(false));
           // clearFields();
           CustomNotification({
             type: 'success',
             title: 'success',
             description: 'Symbol Setting Updated Successfully',
             key: 2
           })
           setIsLoading(false)
           setIsDisabled(true)


       }
       else
       {
           setIsLoading(false)
           CustomNotification({
             type: 'error',
             title: 'error',
             description: message,
             key: `abc`
           })
       }
      }
    }catch(err){
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }

//  const handlePrevious = () => {
//     if (currentIndex > 0) 
//     {
    
//       setCurrentIndex(prevIndex => prevIndex - 1);
//       const payload = ArrangedSymbolGroupsData[currentIndex - 1];
//       dispatch(setSymbolGroupsSelectedIDs([payload.id]))
//       setIsLoading(true)
//       setTimeout(()=>{
//         setIsLoading(false)
//         setStatesForEditMode(payload, true,LeverageList)
//       }, 3000)
      
//     }
//     else
//     {
    
//       CustomNotification({
//             type: 'warning',
//             title: 'warning',
//             description: 'No Previous record found',
//             key: 2
//           })
    
//     }
//   };
  //#region HandlePrevious 

const handlePrevious = async () => {
  if (currentIndex > 0) {
    setCurrentIndex(prevIndex => prevIndex - 1);
    const payload = ArrangedSymbolGroupsData[currentIndex - 1];
    dispatch(setSymbolGroupsSelectedIDs([payload.id]));
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStatesForEditMode(payload, true, LeverageList);
    }, 3000);
  } else {
    const page = localStorage.getItem("page");
    const page_num = Number(page) - 1;

    if (page_num < 1) {
      CustomNotification({
        type: 'warning',
        title: 'warning',
        description: 'No Previous record found',
        key: 2
      });
      return;
    }

    setIsLoading(true);
    const res = await FetchData(page_num, token);
    const newSymbolGroupsData = res?.data?.payload?.data;

    if (newSymbolGroupsData && newSymbolGroupsData.length > 0) {
      dispatch(setSymbolGroupsData(newSymbolGroupsData));
      const newArrangedSymbolGroupsData = newSymbolGroupsData;
      const payload = newArrangedSymbolGroupsData[newArrangedSymbolGroupsData.length - 1];
      dispatch(setSymbolGroupsSelectedIDs([payload.id]));
      setCurrentIndex(newArrangedSymbolGroupsData.length - 1);
      setTimeout(() => {
        setIsLoading(false);
        setStatesForEditMode(payload, true, LeverageList);
      }, 3000);
      localStorage.setItem("page", page_num);
    } else {
      setIsLoading(false);
      CustomNotification({
        type: 'warning',
        title: 'warning',
        description: 'No Previous record found',
        key: 2
      });
    }
  }
};
  // const handleNext = async  () => {
  //   if (currentIndex < ArrangedSymbolGroupsData.length - 1) 
  //   {
  //     setCurrentIndex(prevIndex => prevIndex + 1);
  //     console.log(currentIndex, "YE CURRENT INDEX JA RHA")
  //     const payload = ArrangedSymbolGroupsData[currentIndex + 1];
  //     dispatch(setSymbolGroupsSelectedIDs([payload.id]))
  //     setIsLoading(true)
  //     setTimeout(()=>{
  //       setIsLoading(false)
  //       setStatesForEditMode(payload, true,LeverageList)
  //     }, 3000)
  //   }
  //   else
  //   { 
  //     setCurrentIndex(-1);
  //     const page = localStorage.getItem("page")
  //     const page_num = Number(page) +1; 
  //     setIsLoading(true)
  //     const res = await FetchData(page_num, token)
  //     dispatch(setSymbolGroupsData(res?.data?.payload?.data))
  //     console.log(currentIndex, "YE CURRENT INDEX JA RHA else ma sy")
  //     const payload = ArrangedSymbolGroupsData[currentIndex];
  //     console.log(payload, "YE PAYLOAD HA")
  //     dispatch(setSymbolGroupsSelectedIDs([payload?.id]))
  //     setIsLoading(false)
  //     // setTimeout(()=>{
  //     //   setIsLoading(false)
  //     //   setStatesForEditMode(payload, true,LeverageList)
  //     // }, 3000)
      
  //     //  CustomNotification({
  //     //       type: 'warning',
  //     //       title: 'warning',
  //     //       description: 'No Next record found',
  //     //       key: 2
  //     //     })
  //   }
  // }; 
  //#region HandleNext 
  ///
  const handleNext = async () => {
    if (currentIndex < ArrangedSymbolGroupsData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedSymbolGroupsData[currentIndex + 1];
      dispatch(setSymbolGroupsSelectedIDs([payload.id]));
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStatesForEditMode(payload, true, LeverageList);
      }, 3000);
    } else {
      const page_num = Number(page) + 1;
      setIsLoading(true);
      const res = await FetchData(page_num, token);
      const newSymbolGroupsData = res?.data?.payload?.data;
  
      if (newSymbolGroupsData && newSymbolGroupsData.length > 0) {
        dispatch(setSymbolGroupsData(newSymbolGroupsData));
        const newArrangedSymbolGroupsData = newSymbolGroupsData;
        const payload = newArrangedSymbolGroupsData[0];
        dispatch(setSymbolGroupsSelectedIDs([payload.id]));
        setCurrentIndex(0);
        setTimeout(() => {
          setIsLoading(false);
          setStatesForEditMode(payload, true, LeverageList);
        }, 3000);
        localStorage.setItem("page", page_num);
      } else {
        setIsLoading(false);
        CustomNotification({
          type: 'warning',
          title: 'warning',
          description: 'No Next record found',
          key: 2
        });
      }
    }
  };
  
//#endregion
//   const handleTimeChange = (start_time, end_time) => {
//     console.log('Formatted start time:', start_time);
//     console.log('Formatted end time:', end_time);
//     // Do something with the formatted start and end times
//     setTradingIntervalStartTime(start_time)
//     setTradingIntervalEndTime(end_time)
// };
  
  const setStatesForEditMode = async (payload, success, LeverageList)=>{
    if (success) {
      const selectedOption = LeverageList.find(x=> x.title === payload.leverage)
      setSelectedLeverage(selectedOption)
      setSelectedLeverage(selectedOption)
      setSymbolGroupName(payload.name)
      setLotSize(payload.lot_size);
      setLotStep(payload.lot_step);
      setVolMin(payload.vol_min);
      setVolMax(payload.vol_max);
      // setTradingInterval(payload.trading_interval);
      // setTradingIntervalStartTime(payload?.trading_interval_start_time)
      // setTradingIntervalEndTime(payload?.trading_interval_end_time)
      setTradingTime(JSON.parse(payload?.trading_interval))
      setSwap(payload.swap);
    }
  }
 const deleteHandler = async()=>{
    const Params = {
      table_name:'symbel_groups',
      table_ids: [ArrangedSymbolGroupsData[currentIndex]?.id]
    }
       const onSuccessCallBack = (message)=>{
           CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
         dispatch(deleteSymbolGroupById(ArrangedSymbolGroupsData[currentIndex]?.id))
          if(ArrangedSymbolGroupsData.length === 0 || ArrangedSymbolGroupsData === undefined || ArrangedSymbolGroupsData === null){
            navigate("/symbol-groups")
          }
          else{
              if(currentIndex < ArrangedSymbolGroupsData.length - 1){
                handleNext()
              }
              else{
                handlePrevious()
              }
          }
  }
   await CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading,onSuccessCallBack)
}

    // const items = [
      
    //   {
    //     key: '1',
    //     label: (
    //       <button rel="noopener noreferrer" onClick={()=>{
    //         setIsDisabled(false)
    //       }}>   Edit </button>
    //     ),
    //   },
      
    //   {
    //     key: '2',
    //     label: (
    //       <button  rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
    //     ),
    //   },
    
    // ];
    const items = [
      {
        key: '1',
        label: (
          <button rel="noopener noreferrer" onClick={() => {
            setIsDisabled(false);
          }}>Edit</button>
        ),
      },
    ];
    
    if (ArrangedSymbolGroupsData[currentIndex]?.id !== 1) {
      items.push({
        key: '2',
        label: (
          <button rel="noopener noreferrer" onClick={deleteHandler}>Delete</button>
        ),
      });
    }
  useEffect(()=>{
      if(SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) === 0){ // update case
        setIsDisabled(false)
      }else if (SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) !== 0){
        const cIndex = ArrangedSymbolGroupsData.findIndex(item => parseInt(item.id) === parseInt(SymbolGroupsIds[0]))
        setCurrentIndex(cIndex)
        fetchSymbolGroupWRTID()
        setIsDisabled(true)

      }
      else{
         setIsDisabled(true)
      }
  },[])

  const fetchSymbolGroupWRTID = async()=>{
    if(SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) !== 0){
      setIsLoading(true)
      const res = await SelectSymbolWRTID(SymbolGroupsIds[0], token)
      const {data: {message, payload, success}} = res
      setIsLoading(false)
      if(success){
        setStatesForEditMode(payload,success,LeverageList)
        // const selectedOption = LeverageList.find(x=> x.title === payload.leverage)
        // setSelectedLeverage(selectedOption)
        // setSymbolGroupName(payload.name)
        // setLotSize(payload.lot_size);
        // setLotStep(payload.lot_step);
        // setVolMin(payload.vol_min);
        // setVolMax(payload.vol_max);
        // setTradingTime(JSON.parse(payload?.trading_interval));
        // // setTradingIntervalStartTime(payload.trading_interval_start_time)
        // // setTradingIntervalEndTime(payload.trading_interval_end_time)
        // setSwap(payload.swap);
      }

    }
   
  }

  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex justify-between'>
        <div className='flex gap-3 items-center'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />

       { isDisabled ? <h1 className='text-2xl font-semibold'>Preview Symbol Group</h1> :
      
      <h1 className='text-2xl font-semibold'>{SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) === 0 ? 'Add Symbol Group' : 'Edit Symbol Group'}</h1>
      }
        </div>
    {/* toolbar */}
          {(isDisabled && SymbolGroupsIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) !== 0)  &&
          <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
            {isDisabled && <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />}
            {isDisabled && <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />}
              <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottom"
                  arrow
                  trigger={['click']}
                  
                >
                <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> More <CaretDownOutlined /> </div>

              </Dropdown>
          </div>
          }
      </div>
    <div className='border rounded-lg p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <div>
    
         <CustomTextField
          name='symbolGroupName'
          varient='standard'
          label='Name'
          type={'text'}
          value={symbolGroupName}
           disabled={isDisabled}
          onChange={e => handleInputChange('symbolGroupName', e.target.value)}
          s_value={true}
        />
         {errors.symbolGroupName && <span style={{ color: 'red' }}>{errors.symbolGroupName}</span>}
         </div>
        <div>
        <CustomAutocomplete
            name='Leverage'
            variant='standard'
            label='Select Leverage'
             disabled={isDisabled}
            options={LeverageList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            value={ SelectedLeverage} 
            onChange={(e, value) => {
              if (value) {
                setSelectedLeverage(value);
                setErrors(prevErrors => ({ ...prevErrors, Leverage: '' }));
              } else {
                setSelectedLeverage(null);
                setErrors(prevErrors => ({ ...prevErrors, Leverage: 'Leverage is Requried' }));
              }
            }}
          />
         {errors.Leverage && <span style={{ color: 'red' }}>{errors.Leverage}</span>}
         </div>
         <div>
         <CustomTextField
          name='Swap'
          type={'number'}
          varient='standard'
           disabled={isDisabled}
          label='Swap'
          value={Swap}
          onChange={e => handleInputChange('Swap', e.target.value)}
          s_value={true}

        />
        {errors.Swap && <span style={{ color: 'red' }}>{errors.Swap}</span>}
         </div>
         <div>
         <CustomTextField
          name='LotSize'
          type={'number'}
           disabled={isDisabled}
          varient='standard'
          label='Lot Size'
          value={LotSize}
          onChange={e => handleInputChange('LotSize', e.target.value)}
          s_value={true}

        />
          {errors.LotSize && <span style={{ color: 'red' }}>{errors.LotSize}</span>}
         </div>
       <div>
       <CustomTextField
          name='LotStep'
          type={'number'}
           disabled={isDisabled}
          varient='standard'
          label='Lot Step'
          value={LotStep}
          onChange={e => handleInputChange('LotStep', e.target.value)}
          s_value={true}

        />
        {errors.LotStep && <span style={{ color: 'red' }}>{errors.LotStep}</span>}
       </div>
       <div>
       <CustomTextField
          name='VolMin'
          type={'number'}
           disabled={isDisabled}
          varient='standard'
          label='Vol Min'
          value={VolMin}
          onChange={e => handleInputChange('VolMin', e.target.value)}
          s_value={true}

        />
        {errors.VolMin && <span style={{ color: 'red' }}>{errors.VolMin}</span>}
       </div>
        <div>
        <CustomTextField
          name='VolMax'
          type={'number'}
           disabled={isDisabled}
          varient='standard'
          label='Vol Max'
          value={VolMax}
          onChange={e => handleInputChange('VolMax', e.target.value)}
          s_value={true}

        />
        {errors.VolMax && <span style={{ color: 'red' }}>{errors.VolMax}</span>}
        </div>
        <div className= {!isDisabled ? 'mt-0' : 'mt-5'}>
        
        {/* <CustomTextField
          name='TradingInterval'
          type={'number'}
           disabled={isDisabled}
          varient='standard'
          label='Trading Interval'
          value={TradingInterval}
          onChange={e => handleInputChange('TradingInterval', e.target.value)}
        />
         {errors.TradingInterval && <span style={{ color: 'red' }}>{errors.TradingInterval}</span>} */}
         {/* <CustomDateRangePicker onChange={handleTimeChange} start_time={trading_interval_start_time} end_time={trading_interval_end_time} isDisabled={isDisabled} /> */}
         <button onClick={togglePicker} style={{
          marginBottom: '10px',
          cursor: 'pointer',
          // backgroundColor: '#007bff', // Blue background color
          // color: 'white', // Text color
          padding: '10px 20px', // Padding
          borderRadius: '5px', // Rounded corners
          display: 'inline-block', // Make the div a block element
          // transition: 'background-color 0.3s', // Add transition effect on hover
          // // Add hover effect
          // ':hover': {
          //   backgroundColor: '#0056b3', // Darker blue on hover
          // }
        }}>
           {isDisabled ? ' Show Trading Interval' :  'Select Trading Interval'}
          </button>
          {showPicker && (
            <>
            <div className='m-2 '  style={{
            // position: 'absolute',
            // top: '50%',
            // left: '50%',
            // transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add shadow for a raised effect
          }}>
          <TimePicker  defaultTimes={trading_time} isDisabled={isDisabled} onSave={handleSave}  />
        </div>
          <button onClick={togglePicker}  style={{
              backgroundColor: 'rgb(197, 197, 197)', // Red background color
              color: 'white', // Text color
              padding: '10px 20px', // Padding
              border: 'none', // Remove border
              borderRadius: '5px', // Rounded corners
              cursor: 'pointer',
              // transition: 'background-color 0.3s', // Add transition effect on hover
            }}>Close</button>
            </>
        
      )}
         
        </div>
        
       
      </div>
        {
            !isDisabled && 
  

        <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
          
        <CustomButton
            Text={SymbolGroupsIds?.length === 1 && parseInt(SymbolGroupsIds[0]) === 0 ? 'Submit' : 'Update'}
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
            onClickHandler={handleSubmit}
          />  
          <CustomButton
            Text='Cancel'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
              backgroundColor: '#c5c5c5',
              borderColor: '#c5c5c5',
              color: '#fff'
            }}
            onClickHandler={()=> setIsDisabled(true)}
          />
          

        </div>
      }
    </div>
    </div>
    </Spin>
  )
}

export default SymbolGroupEntry