import { theme, Spin, Dropdown } from 'antd';
import React, { useState,useEffect } from 'react'
import CustomTextField from '../../components/CustomTextField'
import CustomAutocomplete from '../../components/CustomAutocomplete'
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import { LeftOutlined, RightOutlined, EditOutlined,CaretDownOutlined } from '@ant-design/icons';
import CustomNotification from '../../components/CustomNotification';
import { deleteActivityLoginById ,setLoginActivitySelectedRowsIds,updateActivityLogin} from '../../store/ActivityLoginSlice';

import { CheckBrandPermission, CustomBulkDeleteHandler } from '../../utils/helpers';
import { GenericDelete, GenericEdit, SingleUserLoginActivities } from '../../utils/_APICalls';



const ActivityLoginEntry = () => {
  const page = localStorage.getItem("page")
    const isCompleteSelect = localStorage.getItem("isCompleteSelect")
    const token = useSelector(({ user }) => user?.user?.token)
    const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id) 
    const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
    const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)
    const userBrand = useSelector((state)=> state?.user?.user?.brand)
    const dispatch = useDispatch()

  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();



  const navigate = useNavigate()
  const [ip_address, setIp_address] = useState('')
  const [login_time, setLogin_time] = useState('')
  const [mac_address, setMac_address] = useState('')
  const [logout_time,  setLogout_time] = useState('')


  

  const [errors, setErrors] = useState({});

  const [isDisabled, setIsDisabled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [ CurrentPage,setCurrentPage] = useState(1)

  const ActivityLoginIds = useSelector(({ activityLogin }) => activityLogin.selectedActivityRowsIds)
  const ActivityLoginData = useSelector(({activityLogin})=> activityLogin.activityLoginData)
  const ArrangedActivityLoginData= ActivityLoginData;
  
  const Control = [
  
      {
        id: 1,
         control:'CustomTextField',
          label:'IP Address',
          name:'ip_address',
         varient: 'standard',
        //  shrink: true,
         shrink: ip_address,
        value :ip_address,
        onChange:(e,value) =>{
        if(e.target.value){
            setIp_address(e.target.value)
            setErrors(prevErrors => ({ ...prevErrors, ip_address: "" }))
        }
        else{
          setIp_address(null)
          setErrors(prevErrors => ({ ...prevErrors, name: "IP Address is required" }))
        } 
        }     
      },
        {
        id: 2,
         control:'CustomTextField',
          label:'Mac Address',
          name:'mac_address',
         varient: 'standard',
        //  shrink: true,
         shrink: mac_address,
        value :mac_address,
        onChange:(e,value) =>{
        if(e.target.value){
            setMac_address(e.target.value)
            setErrors(prevErrors => ({ ...prevErrors, mac_address: "" }))
        }
        else{
          setMac_address(null)
          setErrors(prevErrors => ({ ...prevErrors, mac_address: "Mac Address is required" }))
        } 
        }     
      },
      {
        id: 3,
         control:'CustomTextField',
          label:'Login Time',
          name:'login_time',
         varient: 'standard',
        //  shrink: true,
         shrink: login_time,
        value :login_time,
        onChange:(e,value) =>{
        if(e.target.value){
            setLogin_time(e.target.value)
            setErrors(prevErrors => ({ ...prevErrors, login_time: "" }))
        }
        else{
          setLogin_time(null)
          setErrors(prevErrors => ({ ...prevErrors, login_time: "Login Time is required" }))
        } 
        }     
      },
       
        {
        id: 4,
         control:'CustomTextField',
          label:'Logout Time',
          name:'logout_time',
          varient: 'standard',
        //  shrink: true,
          shrink: logout_time,
          value :logout_time,
            onChange:(e,value) =>{
            if(e.target.value){
                setLogout_time(e.target.value)
                setErrors(prevErrors => ({ ...prevErrors, logout_time: "" }))
            }
            else{
            setLogout_time(null)
            setErrors(prevErrors => ({ ...prevErrors, logout_time: "Logout Time is required" }))
            } 
            }     
      },
  
    //  {
    //    id: 5, 
    //    control:'CustomAutocomplete',
    //    name:'Username',   
    //    label:'Username', 
    //    varient: 'standard',
    //    options:Countries,
    //    value:SelectedCountry,
    //    getOptionLabel:(option) => option.label ? option.label : "",
    //    onChange:(e,value) =>{
    //      if(value){
    //          setSelectedCountry(value)
    //          setErrors(prevErrors => ({ ...prevErrors, SelectedCountry: "" }))
    //      }
    //      else{
    //          setSelectedCountry(null)
    //      } 
    //      }   
    //  },  
     
  
   
   
  
 ]
 const ComponentMap = {
  CustomTextField: CustomTextField,
  CustomAutocomplete: CustomAutocomplete,
};



const fetchActivityLogin = async () => {

    setIsLoading(true)
    const res = await SingleUserLoginActivities(token,ActivityLoginIds[0] )
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    setStatesForEditMode(payload, success)
  }

 const setStatesForEditMode = async (payload, success)=>{
      if (success) {
        setIsLoading(true)
        setIp_address(payload?.ip_address)
        setMac_address(payload?.mac_address)
        setLogin_time(payload?.login_time)
        setLogout_time(payload?.logout_time)
      
        setIsLoading(false)
      }
   
  }

useEffect(() => {
    if (ActivityLoginIds?.length === 1 && parseInt(ActivityLoginIds[0]) === 0) { // save
       setIsDisabled(false)
    } else if (ActivityLoginIds?.length === 1 && parseInt(ActivityLoginIds[0]) !== 0) { // single edit
      const cIndex = ArrangedActivityLoginData?.findIndex(item => parseInt(item.id) === parseInt(ActivityLoginIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
        

      fetchActivityLogin()
 
    
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);

  

  //#region HandleNExt
  const handleNext = async () => {
    if (currentIndex < ArrangedActivityLoginData?.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedActivityLoginData[currentIndex + 1];
      dispatch(setLoginActivitySelectedRowsIds([payload.id]))
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

 const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedActivityLoginData[currentIndex - 1];
      dispatch(setLoginActivitySelectedRowsIds([payload.id]))
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



   const deleteHandler = async()=>{
    const Params = {
      table_name:'transaction_orders',
      table_ids: [ArrangedActivityLoginData[currentIndex]?.id]
    }
    const onSuccessCallBack = (message)=>{
      CustomNotification({
       type: "success",
       title: "Deleted",
       description: message,
       key: "a4",
     })
     dispatch(deleteActivityLoginById(ArrangedActivityLoginData[currentIndex]?.id))
     if(ArrangedActivityLoginData?.length === 0 || ArrangedActivityLoginData === undefined || ArrangedActivityLoginData === null){
      navigate("/login-activity")
   }
   else{
     if(currentIndex < ArrangedActivityLoginData?.length - 1){
       handleNext()
     }
     else{
       handlePrevious()
     }
   }
  }
    await CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading, onSuccessCallBack )
    
  }

  const items = [
    
    {
      key: '1',
      label: (
        <button rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
      visible: CheckBrandPermission(userPermissions,userRole,'transaction_orders_update')

    },
    {
      key: '2',
      label: (
        <button  rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
     visible: CheckBrandPermission(userPermissions,userRole,'transaction_orders_delete')

    },
   
  ];

  const filteredItems = items.filter(item => item.visible);


 const handleSubmit = async () => {
    try {
       const activityLoginData = { 
        ip_address,
        login_time,
        mac_address,
        logout_time
        };
        setIsLoading(true)
        const Params = {
          table_name: 'user_login_activities',
          table_ids: isCompleteSelect === "true" ? [] : ActivityLoginIds,
          ...activityLoginData
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (res !== undefined) {
          if (success) {
            dispatch(updateActivityLogin(payload))
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Activity Login Updated Successfully',
              key: 2
            })
            setIsDisabled(true)

          } else {
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
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{backgroundColor: colorBG}}>
        
        <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
              <img
                src={ARROW_BACK_CDN}
                alt='back icon'
                className='cursor-pointer'
                onClick={() => navigate("/login-activity")}
              />
              {
                isDisabled ? <h1 className='text-2xl font-semibold'>Activity Login</h1> :
                  <h1 className='text-2xl font-semibold'>{ActivityLoginIds?.length === 1 && parseInt(ActivityLoginIds[0]) === 0 ? 'Add Activity Login' : 'Edit Activity Login'}</h1>
              }
            </div>
            {/* toolbar */}
            {(isDisabled && ActivityLoginIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
            {(ActivityLoginIds?.length === 1 && parseInt(ActivityLoginIds[0]) !== 0)  &&
              <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
            {isDisabled && <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />}
              {isDisabled && <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />}
              {!! filteredItems.length  && (<Dropdown
                menu={{
                  items:filteredItems,
                }}
                placement="bottom"
                arrow
                trigger={['click']}
                
              >
                <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> More <CaretDownOutlined /> </div>

            </Dropdown>)}
            </div>
            }
          
          </div>


        <div className='bg-white border rounded-lg mt-6 p-4'>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {
              Control.map(val=> {
                const ComponentToRender = ComponentMap[val.control]
              return  val.control ===  'CustomAutocomplete' ?
                <div>
                <ComponentToRender
                  name={val.name} 
                  variant={val.varient} 
                  label={val.label}
                  options={val.options}
                  value= {val.value}
                  disabled={isDisabled}
                  getOptionLabel={(option) => val.getOptionLabel(option)}
                  onChange={(e,value) => val.onChange(e,value)} 
                  />
                  {errors?.[val.name] && <span style={{ color: 'red' }}>{errors?.[val.name]}</span>}
                </div>
                  :
                  <div>
                  <ComponentToRender
                  name={val.name} 
                  varient={val.varient} 
                  label={val.label}
                  shrink={val.shrink}
                  disabled={isDisabled}
                  value={val.value}
                  // options={val.options}
                  // getOptionLabel={(option) => val.getOptionLabel(option)}
                  onChange={(e,value) => val.onChange(e,value)} 
                  />
                  {errors?.[val.name] && <span style={{ color: 'red' }}>{errors?.[val.name]}</span>}
                  </div>
                  
                })
              }
          </div>
        
          {
              !isDisabled && <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
             <CustomButton
              Text={ ActivityLoginIds?.length === 1 && parseInt(ActivityLoginIds[0]) === 0 ? 'Submit' : 'Update'}
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',

              }}
              disabled={isDisabled}
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
              onClickHandler={()=> navigate(-1)}
            />
           
            </div>
          }
        
        </div>
      </div>
    </Spin>
  )
}

export default ActivityLoginEntry