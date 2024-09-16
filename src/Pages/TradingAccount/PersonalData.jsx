import { Spin, theme } from 'antd';
import React, { useState,useEffect } from 'react'
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import { numberInputStyle, PDataSaveBtnStyle } from './style';
import { Get_Single_Trading_Account,Put_Trading_Account } from '../../utils/_TradingAPICalls';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { GetAllBrandsCustomerList } from '../../utils/_BrandListAPI';
import { Autocomplete,TextField,Switch } from '@mui/material'
import CustomNotification from '../../components/CustomNotification';
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import {Countries} from '../../utils/constants'
import { CheckBrandPermission } from '../../utils/helpers';
import { alpha } from '@mui/material/styles';


const PersonalData = () => {
  const token = useSelector(({user})=> user?.user?.token );
  const tradingAccountGroupData = useSelector(({tradingAccountGroup})=>tradingAccountGroup?.tradingAccountGroupData)
  
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)

  
  const { token: { colorBG,colorPrimary,colorSuccess  }} = theme.useToken();

  const [name,setName] = useState('')
  const [registration_time,setRegistration_time ] =  useState("")
  const [email,setEmail] = useState('')
  
  const [phone,setPhone] = useState('')
  const [SelectedCountry,SetSelectedCountry] = useState(null)
  const [SelectedCustomerBrand,SetSelectedCustomerBrand] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const trading_account_id = useSelector((state)=>state?.trade?.selectedRowsIds[0])
  const [errors, setErrors] = useState({});
  const [BrandCustomerList,setBrandCustomerList] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)



   const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'registration_time':
        setRegistration_time(value);
        break;
      case 'email':
        setEmail(value);
        break;
        case 'phone':
        setPhone(value);
        break; 
    }
  };
  
 
  
const fetchSingleTradeAccount= async()=>{
      setIsLoading(true)
      const res = await Get_Single_Trading_Account(trading_account_id, token)
      const {data: {message, payload, success}} = res
   
      const { data: {payload:customersList } } = await GetAllBrandsCustomerList(token, tradingAccountGroupData?.brand_id)
      setBrandCustomerList(customersList)



      setIsLoading(false)
      if(success){
        setName(payload?.name)
        setEmail(payload?.email)
        const selectedCountry = Countries.find(country => country.label === payload?.country?.charAt(0).toUpperCase() + payload?.country?.slice(1))
        SetSelectedCountry(selectedCountry)
        setPhone(payload?.phone)
        const registeredDate = payload?.registration_time.split(" ")[0]
        const formattedDate = moment(registeredDate).format('YYYY-MM-DD');
        setRegistration_time(formattedDate)
        const branderCustomer = customersList?.find(x=> x.id === payload?.brand_customer_id) 
        SetSelectedCustomerBrand(branderCustomer)
      }


   
  }

    const clearFields = () =>{
      setName('');
      setEmail('');
      SetSelectedCountry(null)
      setPhone('')
      setRegistration_time('')
    }

  useEffect(()=>{
      
        fetchSingleTradeAccount()
  },[])


  const handleSubmit = async()=> {
    try{
        setIsLoading(true)
        setErrors({});
       const tradingAccountData = {
        
          name,
          email,
          country:SelectedCountry?.label,
          phone,
          registration_time,
          brand_customer_id:SelectedCustomerBrand?.id,
          currency:SelectedCustomerBrand?.currency || ""
        
        }
       
        const res = await  Put_Trading_Account(trading_account_id, tradingAccountData, token)
       const {data: {message, payload, success}} = res
       if(success)
    {
      setIsLoading(false)
     
       CustomNotification({ type: "success", title: "Trading Account", description: message, key: 1 })
      fetchSingleTradeAccount()
    }   
    else{
      setIsLoading(false)
      CustomNotification({ type: "error", title: "Trading Account", description: message, key: 1 })
     
    }    
    
    }catch(err){
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      CustomNotification({ type: "error", title: "Trading Account", description: err.message, key: 1 })
      setErrors(validationErrors);
    }
  }


  return (
    <Spin spinning={isLoading} size="large">
    <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
    
          <div className="flex flex-row justify-end w-full">
              <div></div>
               <Switch
                checked={!isDisabled}
                onChange={()=>setIsDisabled(prev=> !prev)}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: colorPrimary,
                      '&:hover': {
                        backgroundColor: alpha(colorPrimary, colorSuccess),
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: colorPrimary,
                    },

                }}
              />
              
            </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
      

         <div>
         <CustomTextField
          name='Name'
          type={'text'}
          varient='standard'
          disabled={isDisabled}
          label='Name'
          value={name}
          onChange={e => handleInputChange('name', e.target.value)}
        />
        </div>
        <div>
          
         <CustomTextField
          name='date'
          type={'date'}
          varient='standard'
          disabled={isDisabled}
          label='Registered Date'
          value={registration_time}
          onChange={(e) => setRegistration_time(e.target.value)}
        
        />
        
        </div>
         <div>
         <CustomTextField
          name='email'
          type={'text'}
          varient='standard'
          disabled={isDisabled}
          label='Email'
          value={email}
          onChange={e => handleInputChange('email', e.target.value)}
          sx={numberInputStyle}
        />
        </div>
        <div>
          <CustomTextField
          name='Phone'
          type={'number'}
          varient='standard'
          disabled={isDisabled}
          label='Phone'
          value={phone}
          onChange={e => handleInputChange('phone', e.target.value)}
          sx={numberInputStyle}
        />
        </div>

       

        <div>
            <Autocomplete
              name="Countries"
                        id="Countries"
                        variant={'standard'}
                        options={Countries}
                        getOptionLabel={ (option) => option.label ? option.label : ""}
                        value={SelectedCountry}
                        disabled={isDisabled}
                        onChange={(e, value) => {
                          if (value) {
                          
                            SetSelectedCountry(value)
                          }
                          else
                            SetSelectedCountry(null)
                        }}
                        renderInput={(params) =>
                          <TextField {...params} name="Country" label="Select Country" variant="standard" />
                }
              />
        </div>


        <div>
        { userRole === 'brand' &&
          <Autocomplete
          name="Customers"
          id="Customers"
          variant={'standard'}
          disabled={isDisabled}
          options={BrandCustomerList}
          getOptionLabel={ (option) => option.name ? option.name : ""}
          value={SelectedCustomerBrand}
          onChange={(e, value) => {
            if (value) {
            
              SetSelectedCustomerBrand(value)
              setName(value?.name);
                setEmail(value?.email);
                const selectedCountry = Countries.find(country => country.label === value?.country.charAt(0).toUpperCase() + value?.country.slice(1))
                SelectedCountry(selectedCountry)
                setPhone(value?.phone);

            
            }
            else
              SetSelectedCustomerBrand(null)
          }}
          renderInput={(params) =>
            <TextField {...params} name="Customer" label="Select Customer" variant="standard" />
          }
        />
        }   
     
        </div>

          
    </div>
    <div className='flex justify-end'>
     <CustomButton
              Text={'Save Changes'}
              style={PDataSaveBtnStyle}
              onClickHandler={handleSubmit}
              disabled={!CheckBrandPermission(userPermissions,userRole,'trading_account_list_update')|isDisabled}
              
            /> 
    </div>
   
   </div>
  </Spin>
  

  )
}

export default PersonalData