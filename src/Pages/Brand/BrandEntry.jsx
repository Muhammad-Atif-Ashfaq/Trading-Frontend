import React, { useEffect, useState } from 'react';
import CustomTextField from '../../components/CustomTextField';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import { LeftOutlined, RightOutlined, CaretDownOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Brands_List, GenericDelete, GenericEdit, GetSingleBrand, SaveBrands, UpdateBrand } from '../../utils/_APICalls';
import { LeverageList, notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { Dropdown, Spin, theme } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import { deleteBrandById, setBrandData, setBrandSelectedIDs, updateBrandsData } from '../../store/BrandsSlice';
import {  CustomBulkDeleteHandler } from '../../utils/helpers';
import CustomNotification from '../../components/CustomNotification';
import { EditOutlined } from '@mui/icons-material';
import { ChangingPassword } from '../../utils/_SettingAPI';
import { alpha } from '@mui/material/styles';
import { Switch } from '@mui/material';
import CustomPassowordField from '../../components/CustomPassowordField';



const BrandEntry = () => {
  const page = localStorage.getItem("page")
  const isCompleteSelect = localStorage.getItem("isCompleteSelect")
    const BrandIds = useSelector(({ brands }) => brands?.selectedRowsIds)
    const BrandGroupData = useSelector(({brands})=> brands?.brandData)
   const ArrangedBrandData = BrandGroupData;

    const {token: { colorBG,colorPrimary,colorSuccess  }} = theme.useToken()
    const navigate = useNavigate()
    const dispatch  = useDispatch()
  const token = useSelector(({ user }) => user?.user?.token)
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [disabledDomain, setDisabledDomain] = useState(true);
  const [marginCall, setMarginCall] = useState('');
  const [leverage, setLeverage] = useState('');
  const [user_id,setUser_id]= useState('')
  
  const [newPassword,setNewPassword] =  useState('');
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isPasswordDisable,setIsPasswordDisable] = useState(true)



  const [currentIndex, setCurrentIndex] = useState(0)
  const [stop_out,setStop_out]= useState('')
  const fetchData = async (page) => {
    try {
      const res = await Brands_List(token, page);
      const { data: { message, success, payload } } = res
      dispatch(setBrandData(payload.data))
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    domain: Yup.string()
      .required('Domain is required')
      .matches(
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        'Invalid domain'
      ),
    marginCall: Yup.number().required('Margin Call is required').positive('Margin Call must be a positive number'),
    leverage: Yup.object().required('Leverage is required'),
  });

  const passwordValidationSchema = Yup.object().shape({
    newPassword: Yup.string().required('New password is required'),
   
  });

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'domain':
        setDomain(value);
        break;
      case 'marginCall':
        setMarginCall(value);
        break;
        case 'leverage':
          setLeverage(value);
        break;
        case 'stop_out':
          setStop_out(value);
        break;
        case 'newPassword':
        setNewPassword(value);
        break;
      default:
        break;
    }
  };

  const clearFields = () => {
    setName('')
    setDomain('')
    setMarginCall('')
    setLeverage('')
  }

  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/brand')

    }else{
      setIsDisabled(true)
    }
}

  const handleSubmit = async () => {
    try {
       
      const BrandData = {
        name: name,
        domain: domain,
        margin_call: marginCall,
        leverage: leverage.value,
        stop_out,
      }
    //   if (BrandID === 0) {
        if(BrandIds?.length === 1 && parseInt(BrandIds[0]) === 0 || BrandIds[0] === undefined){
          await validationSchema.validate({
            name,
            domain,
            marginCall,
            leverage
          }, { abortEarly: false });

          setErrors({});
        setIsLoading(true)
        const res = await SaveBrands(BrandData, token)
        const { data: { message, payload, success } } = res
        fetchData(page)
        dispatch(setBrandSelectedIDs([payload?.id]))
        setIsLoading(false)
        if (success) {
          notifySuccess(message)
        //   setIsModalOpen(false)
        //   fetchBrands()
          clearFields()
          window.location.reload();
        } else {
          notifyError(message)
        }
      } 
      else {
        setIsLoading(true)
        const Params = {
         table_name: 'brands',
         table_ids: isCompleteSelect === "true" ? [] : BrandIds,
         ...BrandData
      }
      if(parseFloat(marginCall)>parseFloat(stop_out)){
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        if (success)
        {
          dispatch(updateBrandsData(payload))
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Brand Data Updated Successfully',
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
      }else{
        CustomNotification({
            type: 'error',
            title: 'error',
            description: 'Margin Call must be greater than stop out',
            key: 2
          })

          setIsLoading(false)
    
      }
      
    }
      
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

    const handleChangePassword = async () => {
    try {
      await passwordValidationSchema.validate({
        newPassword,
      }, { abortEarly: false });

      setIsLoading(true);

      const passwordData = {
        new_password: newPassword,
        user_id,
      };

      const res = await ChangingPassword(passwordData, token);
      const { data: { message, success } } = res;

      setIsLoading(false);

      if (success) {
        CustomNotification({
          type: 'success',
          title: 'Password Changed Successfully',
          description: message,
          key: 1
        });
        fetchDataWRTID()
      } else {
        CustomNotification({
          type: 'error',
          title: 'Password Changed Failed',
          description: message,
          key: 2
        });
      }

    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      setIsLoading(false);
    }
  };


  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedBrandData[currentIndex - 1];
      dispatch(setBrandSelectedIDs([payload.id]))
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,LeverageList)
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

  const handleNext = () => {
    if (currentIndex < ArrangedBrandData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedBrandData[currentIndex + 1];
      dispatch(setBrandSelectedIDs([payload.id]))
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,LeverageList)
      }, 3000)
    }else
    {
      
       CustomNotification({
            type: 'warning',
            title: 'warning',
            description: 'No Next record found',
            key: 2
          })
    }
  }; 

  const setStatesForEditMode = async (payload, success, LeverageList)=>{
    if (success) {
      const selectedOption = LeverageList.find(x=> x.title === payload.leverage)
      setLeverage(selectedOption)
      setName(payload?.name)
      setDomain(payload?.domain)
      setMarginCall(payload?.margin_call)
      setNewPassword(payload?.user?.original_password)
    }
  }

  const deleteHandler = async ()=>{
    const Params = {
      table_name:'brands',
      table_ids: [ArrangedBrandData[currentIndex]?.id]
    }
    const onSuccessCallBack = (message)=>{
      CustomNotification({
       type: "success",
       title: "Deleted",
       description: message,
       key: "a4",
     })
    dispatch(deleteBrandById(ArrangedBrandData[currentIndex]?.id))
     if(ArrangedBrandData.length === 0 || ArrangedBrandData === undefined || ArrangedBrandData === null){
       navigate("/brand")
     }
     else{
         if(currentIndex < ArrangedBrandData.length - 1){
           handleNext()
         }
         else{
           handlePrevious()
         }
     }
}
   await  CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading, onSuccessCallBack)
    
  }

  const items = [
    
    {
      key: '1',
      label: (
        <button rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
    },
    {
      key: '2',
      label: (
        <button  rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
    },
   
  ];

  useEffect(() => {
    clearFields()
    if(BrandIds?.length === 1 && parseInt(BrandIds[0]) === 0){ 
        setIsDisabled(false)
        setDisabledDomain(false)
      }
      else if (BrandIds?.length === 1 && parseInt(BrandIds[0]) !== 0){
        const cIndex = ArrangedBrandData.findIndex(item => parseInt(item.id) === parseInt(BrandIds[0]))
        setCurrentIndex(cIndex)
        fetchDataWRTID()
        setIsDisabled(true)

      }
    // if (BrandID !== 0) { // update
    // //   setDisabledDomain(true)
    //   fetchDataWRTID()
    // } 
    else {
      setIsDisabled(true)
    }
  }, [])

  const fetchDataWRTID = async () => {
    if(BrandIds?.length === 1 && parseInt(BrandIds[0]) !== 0){
    setIsLoading(true)
    const res = await GetSingleBrand(BrandIds[0], token)
    const { data: { payload, message, success } } = res
    setIsLoading(false)
    if (success) {
        const selectedOption = LeverageList.find(x=> x?.title === payload?.leverage)
        setLeverage(selectedOption)
      setName(payload.name)
      setDomain(payload.domain)
      setMarginCall(payload.margin_call)
      setStop_out(payload.stop_out)
      setUser_id(payload.user_id)
      setNewPassword(payload?.user?.original_password)
      //   setLeverage(payload.leverage)
    } else {
      notifyError(message)
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
              onClick={() => navigate("/brand")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Brands</h1> :
                <h1 className='text-2xl font-semibold'>{BrandIds?.length === 1 && parseInt(BrandIds[0]) === 0 ? 'Add New Brand' : 'Edit Brand'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && BrandIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(BrandIds?.length === 1 && parseInt(BrandIds[0]) !== 0 && isDisabled)  &&
            <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
           <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />
            <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />
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
      <div className='flex flex-col gap-6'>


        <CustomTextField
          label="Name"
          varient="standard"
          type="text"
          value={name}
          disabled={isDisabled}
          onChange={e => handleInputChange('name', e.target.value)}
          s_value={true}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

        <CustomTextField
          label="Domain"
          varient="standard"
          type="text"
          disabled={disabledDomain}
        //   disabled={isDisabled}
          value={domain}
          onChange={e => handleInputChange('domain', e.target.value)}
          s_value={true}

        />
        {errors.domain && <span style={{ color: 'red' }}>{errors.domain}</span>}

        <CustomTextField
          label="Margin Call"
          varient="standard"
          type="number"
          // InputProps={{
          //   inputProps: { min: 1, max: 100 },
          // }}
          disabled={isDisabled}
          value={marginCall}
          s_value={true}
          onChange={e => {
            // if(e.target.value >= 0 && e.target.value <= 100){
            //   handleInputChange('marginCall', e.target.value)
            // }
              handleInputChange('marginCall', e.target.value)
            
          }}
          
        />
        {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}

         <CustomTextField
          label="Stop Out"
          varient="standard"
          type="number"
          value={stop_out}
          disabled={isDisabled}
          onChange={e => handleInputChange('stop_out', e.target.value)}
          s_value={true}

        />

        <CustomAutocomplete
          label="Select Leverage"
          name='Leverage'
          variant="standard"
          options={LeverageList}
          disabled={isDisabled}
          value={leverage}
          getOptionLabel={(option) => option.title ? option.title : ""}
          onChange={(e, value) => handleInputChange('leverage', value)}

              // name={val.name} 
              // variant={val.varient} 
              // label={val.label}
              // required={val.required}
              // options={val.options}
              // getOptionLabel={(option) => val.getOptionLabel(option)}
              // onChange={(e,value) => val.onChange(e,value)}
        />
        {errors.leverage && <span style={{ color: 'red' }}>{errors.leverage}</span>}
       
        {/* <div style={footerStyle}>
          <CustomButton
            Text={ BrandID === 0 ? 'Submit' :'Update'}
            style={submitStyle}
            onClickHandler={handleSubmit}
          />
          
        </div> */}
        
       

     

       {!isDisabled && 
  

        <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
          
        <CustomButton
            Text={BrandIds?.length === 1 && parseInt(BrandIds[0]) === 0 ? 'Submit' : 'Update'}
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
            onClickHandler={cancleHandler}
          />
          

        </div>
      }

         <div className='mb-6 flex flex-col gap-6'>

          <div className="flex flex-row justify-between">
          <div></div>
          <Switch
                checked={!isPasswordDisable}
                onChange={()=>setIsPasswordDisable(prev=> !prev)}
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

        <CustomPassowordField
          label={'New Password'}
          value={newPassword}
          disabled={isPasswordDisable}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          name={"newPassword"}
        />
        {errors.newPassword && <span style={{ color: 'red' }}>{errors.newPassword}</span>}

        {!isPasswordDisable && <div className='flex flex-row justify-end'>
            <div></div>
          <CustomButton
            Text='Change Password'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              marginTop:"10px",
              borderRadius: '8px', 
            }}
            onClickHandler={handleChangePassword}
            loading={isLoading}
          /> 
        </div>
        }
         

        
      </div>

        <ToastContainer />
      </div>
      </div>
    </Spin>
  );
};

export default BrandEntry;
