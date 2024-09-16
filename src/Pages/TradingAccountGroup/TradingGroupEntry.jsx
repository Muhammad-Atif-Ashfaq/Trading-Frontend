import { Dropdown, Spin, theme } from 'antd';
import React, { useState,useEffect } from 'react'
import * as Yup from 'yup';
import { LeftOutlined, RightOutlined, CaretDownOutlined, EditOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import CustomButton from '../../components/CustomButton';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { SaveTradingAccountGroups, SelectTradingAccountGroupWRTID, Trading_Account_Group_List, UpdateTradingAccountGroups, getAllTradingAccountsNotInGroup } from '../../utils/_TradingAccountGroupAPI';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomTextField from '../../components/CustomTextField';
import { Autocomplete, TextField } from '@mui/material';
import { LeverageList } from '../../utils/constants';
import { submitStyle } from '../TradingAccount/style';
import { Symbol_Group_List } from '../../utils/_SymbolSettingAPICalls';
import { GetBrandsList } from '../../utils/_BrandListAPI';
import { GenericDelete, GenericEdit } from '../../utils/_APICalls';
import { deleteTradeGroupById, setTradeGroupsData, setTradeGroupsSelectedIDs, updateTradeGroupData } from '../../store/tradeGroupsSlice';
import { CheckBrandPermission, CustomBulkDeleteHandler } from '../../utils/helpers';
import CustomNotification from '../../components/CustomNotification';

const TradingGroupEntry = () => {
  const page = localStorage.getItem("page")
  const isCompleteSelect = localStorage.getItem("isCompleteSelect")
    const { token: { colorBG } } = theme.useToken();
    const navigate = useNavigate()
    const dispatch = useDispatch()
  ////////////////////////////////Reudx/////////////////////////////////////////////////////////////////////
    const TradingAccountGroupsIds = useSelector(({ tradeGroups }) => tradeGroups?.selectedRowsIds)
    const TradingAccountGroupData = useSelector(({tradeGroups})=> tradeGroups?.tradeGroupsData)
    const ArrangedTradingGroupData = TradingAccountGroupData;
    const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
    const userBrand = useSelector((state)=> state?.user?.user?.brand)
    const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)
    const token = useSelector(({ user }) => user?.user?.token)
   ////////////////////////////////////STATES///////////////////////////////////////////////////////////////////////////
   const [GroupList, setGroupList] = useState([]);
   const [SelectedGroup, setSelectedGroup] = useState(null);
   const [AccountList, setAccountList] = useState([]);
   const [SelectedAccountList, setSelectedAccountList] = useState(null);
   const [isLoading, setIsLoading] = useState(false)
   const [isDisabled, setIsDisabled] = useState(false)
   const [name, setName] = useState('');
   const [massLeverage, setMassLeverage] = useState('')
   const [massSwap, setMassSwap] = useState('')
   const [errors, setErrors] = useState({});
   const [brandList,setBrandList] = useState([])
   const [selectedBrand,setSelectedBrand] =  useState(null)
   const [currentIndex, setCurrentIndex] = useState(0)
   /////////////////////////////////////////////////////////////////////
   const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    SymbolGroup: Yup.array().required('Group is required'),
    // Account: Yup.array().required('Account is required'),
    massLeverage: Yup.object().required('Mass Leverage is required'),
    massSwap: Yup.string().required('Mass Swap is required')
  });
  const fetchData = async (brandId) => {
    try {
      const res = await Trading_Account_Group_List(token, brandId);
      const { data: { message, success, payload } } = res
      dispatch(setTradeGroupsData(payload.data))
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
        case 'massSwap':
        setMassSwap(value);
        break;
      default:
        break;
    }
  };
  const clearFields = () => {
    setName('')
    setMassLeverage('')
    setMassSwap('')
    setSelectedGroup(null)
    setSelectedAccountList(null)
    setErrors({})
    setIsDisabled(false)
    setSelectedBrand(null)
  }
  const deleteHandler = async()=>{
    const Params = {
      table_name:'trading_groups',
      table_ids: [ArrangedTradingGroupData[currentIndex]?.id]
    }
    const onSuccessCallBack = (message) => {
      CustomNotification({
        type: "success",
        title: "Deleted",
        description: message,
        key: "a4",
      })
      dispatch(deleteTradeGroupById(ArrangedTradingGroupData[currentIndex]?.id))
      if(ArrangedTradingGroupData?.length === 0 || ArrangedTradingGroupData === undefined || ArrangedTradingGroupData === null){
         navigate("/trading-group")
         navigate(0)
      }else{
        if(currentIndex < ArrangedTradingGroupData?.length - 1)
          {
            handleNext()
          }
        else
        {
          handlePrevious()
        }
      }
    }
    
   await CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading, onSuccessCallBack )
   
    

  }
  useEffect(() => {
    clearFields()
    getSymbolGroups()
    if( userRole === 'brand' ){
      getAccountList(userBrand.public_key)
    } 
    else{
          getBrandsList()
    }
    if(TradingAccountGroupsIds?.length === 1 && parseInt(TradingAccountGroupsIds[0]) === 0){ 
        setIsDisabled(false)
      }
      else if (TradingAccountGroupsIds?.length === 1 && parseInt(TradingAccountGroupsIds[0]) !== 0){
        
        const cIndex = ArrangedTradingGroupData?.findIndex(item => parseInt(item.id) === parseInt(TradingAccountGroupsIds[0]))
        setCurrentIndex(cIndex)
        fetchDataWRTID()
        setIsDisabled(true)

      }
    else {
      setIsDisabled(true)
    }
  }, [])
  const items = [
    
    {
      key: '1',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
      visible: CheckBrandPermission(userPermissions,userRole,'trading_account_group_update')

    },
    {
      key: '2',
      label: (
        <button  className='w-full text-left' rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
      visible: CheckBrandPermission(userPermissions,userRole,'trading_account_group_delete')

    },
   
  ];

    const filteredItems = items.filter(item => item.visible);

  const fetchDataWRTID = async () => {
    setIsLoading(true)
    const res = await SelectTradingAccountGroupWRTID(TradingAccountGroupsIds[0], token)
    const { data: { payload, message, success } } = res
    setIsDisabled(true)
    setStatesForEditMode(payload, success)
    setIsLoading(false)
  }
  const setStatesForEditMode = async (payload, success)=>{
    try{
      if (success) {
        if(userRole === 'admin'){
          getBrandsList(payload.brand_id)
        }
        setName(payload.name)
        const selectedMassLeverage = LeverageList?.find((leverage)=>leverage.title === payload?.mass_leverage )
        setMassLeverage(selectedMassLeverage)
        setMassSwap(payload.mass_swap)
        const groupRes = await Symbol_Group_List(token)
        const { data: { success, message, payload : {data: AllGroups} } } = groupRes
        const selectedOptions = AllGroups?.filter(option => {
          return payload.symbel_groups?.some(symbol => symbol.pivot.symbel_group_id === option.id);
        });
        setSelectedGroup(selectedOptions);
        setIsLoading(false)
      } else {
        notifyError(message)
      }
    }catch(err){
      alert(err.message)
    }finally{
      setIsLoading(false)
    }
  }
  const getSymbolGroups = async () => {
    setIsLoading(true)
    const res = await Symbol_Group_List(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setGroupList(payload.data)
    }
  }
 
  const getAccountList = async (brandId) => {
    setIsLoading(true)
    
    const res = await getAllTradingAccountsNotInGroup(token,brandId)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setAccountList(payload)
    }
  }

  const getBrandsList = async (brandId) =>{
    setIsLoading(true)
    const res = await GetBrandsList(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setBrandList(payload)
      const Brand = payload?.find((brand)=>brand.public_key === brandId )
      setSelectedBrand(Brand)
       
    }
  }

  const handleSumbit = async () => {
    try {
      if (TradingAccountGroupsIds?.length < 2) {
      await validationSchema.validate({
        SymbolGroup: SelectedGroup,
        name,
        massLeverage,
        massSwap, 
      }, { abortEarly: false });
      setErrors({})
    }
      const TradingGroupData = {
        name,
        mass_leverage: massLeverage?.value,
        mass_swap: massSwap,
        symbel_group_ids: SelectedGroup?.map(item => item.id),
        trading_account_ids: SelectedAccountList ? SelectedAccountList?.map(item => item.id) : [],
        brand_id:userRole === 'brand'? userBrand?.public_key :  selectedBrand?.public_key   

       }

       if (TradingAccountGroupsIds?.length === 1 && parseInt(TradingAccountGroupsIds[0]) === 0 || TradingAccountGroupsIds[0] === undefined) { // save
        setIsLoading(true)
        const res = await SaveTradingAccountGroups(TradingGroupData, token)
        const { data: { message, payload, success } } = res
        fetchData(userBrand?.public_key)
        dispatch(setTradeGroupsSelectedIDs([payload?.id]))
        setIsLoading(false)
        if (success) {
          CustomNotification({
            type: 'success',
            title: 'success',
            description: message,
            key: 2
          })
          clearFields()
          window.location.reload();

        } else {
      setIsLoading(false)
          CustomNotification({
            type: 'error',
            title: 'Oppss..',
            description: message,
            key: 2
          })
        }

      }
      else{
        setIsLoading(true)
        const Params = {
          table_name: 'trading_groups',
          table_ids: isCompleteSelect === "true" ? [] : TradingAccountGroupsIds,
          ...TradingGroupData
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if(success) {
          dispatch(updateTradeGroupData(payload))
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Trading Account Updated Successfully',
            key: 2
          })
          navigate('/trading-group')

        }
        else {
          setIsLoading(false)
          CustomNotification({
            type: 'error',
            title: 'error',
            description: message,
            key: `abc`
          })
        }
      }
      

    } catch (err) {
      const validationErrors = {};
      err?.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }
  //#region HandlePRevious
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedTradingGroupData[currentIndex - 1];
      dispatch(setTradeGroupsSelectedIDs([payload.id]))
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
    }
    else
    {
      CustomNotification({
            type: 'warning',
            title: 'warning',
            description: 'No Previous record found',
            key: 2
          })
    
    }
  };

  // #region handleNExt
  const handleNext = () => {
    
    if (currentIndex < ArrangedTradingGroupData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedTradingGroupData[currentIndex + 1];
      dispatch(setTradeGroupsSelectedIDs([payload.id]))
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
    }else{
      CustomNotification({
        type: 'warning',
        title: 'warning',
        description: 'No Next record found',
        key: 2
      })
    }
  }; 
  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/trading-group')
      navigate(0)

    }else{
      setIsDisabled(true)
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
            onClick={() => {
              navigate("/trading-group")
              navigate(0)
            }}
          />
          {
            isDisabled ? <h1 className='text-2xl font-semibold'>Preview Trading Account Group</h1> :
              <h1 className='text-2xl font-semibold'>{TradingAccountGroupsIds?.length === 1 && parseInt(TradingAccountGroupsIds[0]) === 0 ? 'Add Trading Account Group' : 'Edit Trading Account Group'}</h1>
          }
        </div>
        {/* toolbar */}
        {(isDisabled && TradingAccountGroupsIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
        {(TradingAccountGroupsIds?.length === 1 && parseInt(TradingAccountGroupsIds[0]) !== 0 && isDisabled)  &&
          <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
         <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />
          <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />
           {!! filteredItems.length  && (
            <Dropdown
              menu={{
                items:filteredItems,
              }}
              placement="bottom"
              arrow
              trigger={['click']}
              
            >
              <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> More <CaretDownOutlined /> </div>
            </Dropdown>
          )} 
        </div>
        }
      
      </div>
      <div className='border rounded-lg p-4'>
      <div className='flex flex-col gap-6'>
        <div>
          <CustomTextField
            name='name'
            varient='standard'
            label='Group Name'
            value={name}
            disabled={isDisabled}
            onChange={e => handleInputChange('name', e.target.value)}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>

        
       {userRole === 'admin' && <div>
          <CustomAutocomplete
            name='brandsList'
            variant='standard'
            label='Select Brands'
            options={brandList}
            getOptionLabel={(option) => option?.name ? option?.name : ""}
            value={ selectedBrand} 
            disabled={isDisabled}
            onChange={(e, value) => {
              if (value) {
                setSelectedBrand(value);
                getAccountList(value.public_key)
              } else {
                setSelectedBrand(null);
              }
            }}
          />
         
        </div>  
        }

        <div> 
        <Autocomplete
          multiple
          limitTags={2}
          id="symbolGroup"
          options={GroupList}
          getOptionLabel={(option) => option.name ? option.name : '' }
          value={SelectedGroup ?  SelectedGroup : []}
          disabled={isDisabled}
          onChange={(e, value) => {
            if (value) {
              setSelectedGroup(value);
              setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: '' }));
            } else {
              setSelectedGroup(null);
              setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: 'Symbol Group is requried' }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Symbol Group" placeholder="Symbol Group" variant="standard" />
          )}
          fullWidth
        />
          {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
        </div>
     
        <div>
              <CustomAutocomplete
                name='Leverage'
                variant='standard'
                label='Select Mass Leverage'
                options={LeverageList}
                getOptionLabel={(option) => option.title ? option.title : ""}
                value={massLeverage}
                disabled={isDisabled}
                onChange={(e, value) => {
                  if (value) {
                    setMassLeverage(value);
                    setErrors(prevErrors => ({ ...prevErrors, massLeverage: '' }));
                  } else {
                  setMassLeverage(null);
                    setErrors(prevErrors => ({ ...prevErrors, massLeverage: 'Select Mass Leverage is Requried' }));
                  }
                }}
              />
            {errors.massLeverage && <span style={{ color: 'red' }}>{errors.massLeverage}</span>}
            </div>
        <div>
          <CustomTextField
            name='massSwap'
            type={'number'}
            varient='standard'
            label='Mass Swap'
            value={massSwap}
            disabled={isDisabled}
            onChange={e => handleInputChange('massSwap', e.target.value)}
          />
          {errors.massSwap && <span style={{ color: 'red' }}>{errors.massSwap}</span>}
        </div>
        <div>
          <CustomAutocomplete
            multiple={true}
            name='accounts'
            variant='standard'
            label='Select Accounts'
            options={AccountList}
            disabled = {isDisabled}
            getOptionLabel={(option) => option.login_id ? option.login_id : ""}
            value={ SelectedAccountList ?  SelectedAccountList : []} 
            onChange={(e, value) => {
              if (value) {
                setSelectedAccountList(value);
              } else {
                setSelectedAccountList(null);
              }
            }}
          />
         
        </div>
      </div>
      {!isDisabled && <div className='flex items-center justify-end gap-4'>
      <CustomButton
          Text={ TradingAccountGroupsIds?.length === 1 && parseInt(TradingAccountGroupsIds[0]) === 0 ? 'Submit' : 'Update'}
          style={submitStyle}
          onClickHandler={handleSumbit}
          disabled={isDisabled}
        />
        <CustomButton
          Text={'Cancle'}
          style={{ backgroundColor: '#C5C5C5', borderColor: '#C5C5C5', color: '#fff', ...submitStyle }}
          disabled={isDisabled}
          onClickHandler={cancleHandler}
       />
        

      </div>}
      </div>
    </div>
  </Spin>
  )
}

export default TradingGroupEntry
