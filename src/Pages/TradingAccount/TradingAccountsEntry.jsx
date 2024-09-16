import { theme, Spin, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { LeverageList,CurrenciesList,Countries } from '../../utils/constants';
import CustomButton from '../../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import CustomNotification from '../../components/CustomNotification';
import { GenericEdit, GenericDelete } from '../../utils/_APICalls';
import { CheckBrandPermission, CustomBulkDeleteHandler } from '../../utils/helpers';
import { deleteSymbolSettingsById } from '../../store/symbolSettingsSlice';
import { EditOutlined } from '@mui/icons-material';
import { GetAllBrandsCustomerList,GetBrandsList } from '../../utils/_BrandListAPI';
import { Get_Single_Trading_Account, Update_Trading_Account } from '../../utils/_TradingAPICalls';
import { ALL_Trading_Account_Group_List } from '../../utils/_TradingAccountGroupAPI';
const TradingAccountsEntry = () => {
  const isCompleteSelect = localStorage.getItem("isCompleteSelect")
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const userPermissions = useSelector((state)=>state?.user?.user?.user?.permissions)
  const userBrand = useSelector((state)=> state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const TradingAccountsIds = useSelector(({ trade }) => trade.selectedRowsIds)
  const TradingAccountsData = useSelector(({trade})=> trade.tradingAccountsData)
  const ArrangedTradingAccountsData = TradingAccountsData;
  const [brandList,setBrandList] = useState([])
  const [brandCustomerList, setBrandCustomerList] = useState([])
  const [tradingAccountGroupList, setTradingAccountGroupList] = useState([])
  
  const initialValues= {
    country:null,
    phone:"",
    email:"",
    balance:"",
    leverage:null,
    swap:"",
    currency:null,
    brand_id:"",
    trading_group_id:null,
    status:"active"

  }

  
  const [tradingAccount,setTradingAccount] = useState(initialValues) 

  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false)

   const Control = [

    {
      id: 14,
      control: 'CustomAutocomplete',
      name: 'Brands',
      label: 'Brands',
      required: true,
      varient: 'standard',
      display: userRole === 'admin' ? 'show' : 'hide',
      options: brandList,
      value: tradingAccount.brand_id,
      getOptionLabel: (option) => option.name ? option.name : "",
      onChange: (e, value) => {

        if (value) {
          setErrors(prevErrors => ({ ...prevErrors, brand_id: "", leverage: "" }))
          setTradingAccount(prevData => ({
            ...prevData,
            brand_id: value,
            leverage: LeverageList?.find(x => x.title === value.leverage)
          }))
        }
        else {
          setTradingAccount(prevData => ({
            ...prevData,
            brand_id: null
          }))
        }
      }
    },
    {
      id: 20,
      control: 'CustomAutocomplete',
      display: 'show',
      name: 'Leverage',
      label: 'Leverage',
      required: true,
      varient: 'standard',
      options: LeverageList,
      value: tradingAccount.leverage,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        if (value) {
          setErrors(prevErrors => ({ ...prevErrors, leverage: "" }))
          setTradingAccount(prevData => ({
            ...prevData,
            leverage: value
          }))
        }
        else {
          setTradingAccount(prevData => ({
            ...prevData,
            leverage: null
          }))
        }
      }
    },

    {
      id: 5, control: 'CustomTextField', display: 'show', label: 'Email', required: true, varient: 'standard', value: tradingAccount.email, onChange: (e) => {
        setTradingAccount(prevData => ({
          ...prevData,
          email: e.target.value
        }));
      }
    },
    {
      id: 12,
      control: 'CustomTextField',
      display: 'show',
      name: 'Phone',
      label: 'Phone',
      varient: 'standard',
      value: tradingAccount.phone,
      onChange: (e) => {
        setTradingAccount(prevData => ({
          ...prevData,
          phone: e.target.value
        }));
      }
    },
    {
      id: 3,
      control: 'CustomAutocomplete',
      display: 'show',
      name: 'Country',
      label: 'Country',
      varient: 'standard',
      options: Countries,
      getOptionLabel: (option) => option.label ? option.label : "",
      value: tradingAccount.country,
       onChange: (e, value) => {
        if (value) {
          setErrors(prevErrors => ({ ...prevErrors, leverage: "" }))
          setTradingAccount(prevData => ({
            ...prevData,
            country: value
          }))
        }
        else {
          setTradingAccount(prevData => ({
            ...prevData,
            country: null
          }))
        }
      }
    },

    {
      id: 7, control: 'CustomTextField', display: 'show', label: 'Balance', varient: 'standard', value: tradingAccount.balance, onChange: (e) => {

        setTradingAccount(prevData => ({
          ...prevData,
          balance: e.target.value
        }))
      }
    },
    {
      id: 18, control: 'CustomTextField', display: 'show', label: 'Swap', required: true, varient: 'standard', value: tradingAccount.swap, onChange: (e) => {

        setTradingAccount(prevData => ({
          ...prevData,
          swap: e.target.value
        }))
      }
    },
    {
      id: 13,
      control: 'CustomAutocomplete',
      name: 'Currency',
      display: 'show',
      label: 'Currency',
      required: true,
      varient: 'standard',
      options: CurrenciesList,
      value: tradingAccount.currency,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        setErrors(prevErrors => ({ ...prevErrors, currency: "" }))
        if (value) {
          setTradingAccount(prevData => ({
            ...prevData,
            currency: value
          }))
        }
        else {
          setTradingAccount(prevData => ({
            ...prevData,
            currency: null
          }))
        }
      }
    },
    {
      id: 1,
      control: 'CustomAutocomplete',
      name: 'Customer',
      display: userRole !== 'admin' ? 'show' : 'hide',
      label: 'Customer',
      varient: 'standard',
      options: brandCustomerList,
      value: tradingAccount.brand_customer_id,
      getOptionLabel: (option) => option.name ? option.name : "",
      onChange: (e, value) => {
        if (value) {
          setErrors(prevErrors => ({ ...prevErrors, brand_customer_id: "" }))
          setTradingAccount(prevData => ({
            ...prevData,
            brand_customer_id: value
          }))
        }
        else {
          setTradingAccount(prevData => ({
            ...prevData,
            brand_customer_id: null
          }))
        }
      }
    },
    {
      id: 4,
      control: 'CustomAutocomplete',
      name: 'Trading Group',
      display: 'show',
      label: 'Trading Group',
      varient: 'standard',
      options: tradingAccountGroupList,
      value: tradingAccount.trading_group_id,
      getOptionLabel: (option) => option.name ? option.name : "",
      onChange: (e, value) => {
        if (value) {
          setErrors(prevErrors => ({ ...prevErrors, trading_group_id: "" }))
          setTradingAccount(prevData => ({
            ...prevData,
            trading_group_id: value
          }))
        }
        else {
          setTradingAccount(prevData => ({
            ...prevData,
            trading_group_id: null
          }))
        }
      }
    },
  ]

  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPhoneNo: CustomPhoneNo,
  };


    const getBrandsList = async () => {
        
    setIsLoading(true)
    const res = await GetBrandsList(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setBrandList(payload?.data)
     
    }
  }

  const getAllBrandsCustomerList = async () => {
  
    setIsLoading(true)
    const res = await GetAllBrandsCustomerList(token, userBrand?.public_key)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
      if (success) {
      setIsLoading(false)
      setBrandCustomerList(payload)
    }
  }




   const fetchSingleTradingAccount = async () => {
    setIsLoading(true)
    const { data: { payload, success } } = await Get_Single_Trading_Account(TradingAccountsIds[0],token)
     
    setIsLoading(false)
    setStatesForEditMode(payload, success)
    
    

  }




  const {
    token: { colorBG },} = theme.useToken();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)


 
  const setStatesForEditMode = async (payload, success)=>{
      if (success) {
         setIsLoading(true)

          const res = await GetBrandsList(token)
          const {data:{payload, message, success}} = res
          setBrandList(payload)

          const { data }  = await GetAllBrandsCustomerList(token, userBrand?.public_key)
          setIsLoading(false)
          setBrandCustomerList(data?.payload)
       
          const  groups  = await ALL_Trading_Account_Group_List(token)
          setTradingAccountGroupList(groups?.data?.payload)
          
         
        const values= {
          country:Countries.find(country => country.label === payload?.country?.charAt(0).toUpperCase() + payload?.country?.slice(1)),
          phone:payload.phone,
          email:payload.email,
          balance:payload.balance,
          leverage:LeverageList.find(x => x.title === payload?.leverage),
          swap:payload.swap,
          currency:CurrenciesList.find(x=>x.value === payload?.currency),
          brand_id:payload.brand_id,
          trading_group_id:tradingAccountGroupList?.find((x)=>x?.id === payload?.trading_group_id),
          status:"active"
        }

          setTradingAccount({ ...tradingAccount,...values})

          setIsLoading(false)
      }
    
  }



  const fetchTradingAccountGroups = async () => {
    setIsLoading(true)
       const { data: { payload, success } }  = await ALL_Trading_Account_Group_List(token)
    setIsLoading(false)
    if (success) {
      setTradingAccountGroupList(payload)
   
    }

  }

 
  const handleNext = () => {
    if (currentIndex < ArrangedTradingAccountsData?.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedTradingAccountsData[currentIndex + 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
    }else{
      alert(`no next record found`)
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedTradingAccountsData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
      
    }
  };

  useEffect(() => {

    if (TradingAccountsIds?.length === 1 && parseInt(TradingAccountsIds[0]) === 0) { // save
      setIsDisabled(false)
    } else if (TradingAccountsIds?.length === 1 && parseInt(TradingAccountsIds[0]) !== 0) { // single edit
      const cIndex = ArrangedTradingAccountsData?.findIndex(item => parseInt(item?.id) === parseInt(TradingAccountsIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
      // getBrandsList()
      // getAllBrandsCustomerList()
      // fetchTradingAccountGroups()
      fetchSingleTradingAccount()
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);



  const handleSubmit = async () => {
    
    try {
      const selectedBrand =  brandList?.find((brand)=>brand?.public_key === tradingAccount?.brand_id)

      const formPayload = {
        ...tradingAccount,
        brand_id:userRole === 'admin' ? selectedBrand.public_key :tradingAccount.brand_id,
        margin_level_percentage:userRole === 'admin' ? selectedBrand?.margin_call :userBrand?.margin_call,
        leverage: tradingAccount.leverage?.value,
        currency: tradingAccount.currency?.value,
        brand_customer_id: tradingAccount.brand_customer_id?.id,
        trading_group_id: tradingAccount.trading_group_id?.id,
        country : tradingAccount.country.label.charAt(0).toUpperCase() + tradingAccount.country.label.slice(1),
        phone:tradingAccount.phone,
        email:tradingAccount.email,
        balance:tradingAccount.balance,
        swap:tradingAccount.swap,
        status:"active"


      }

   

    
      if (TradingAccountsIds?.length === 1 && parseInt(TradingAccountsIds[0]) === 0) { // save 
        setIsLoading(true)
        const res = await Save_Trading_Account(formPayload, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          setTradingAccount(initialValues)
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Trading Account Created Successfully',
            key: 2
          })
        } else {
          setIsLoading(false)
          if (payload) {
            const { feed_fetch_name } = payload
            Selectedenable.title = 'Yes' ? 'Yes' : 'No',
              CustomNotification({
                type: 'error',
                title: message,
                description: feed_fetch_name[0],
                key: 1
              })
          } else {
            CustomNotification({
              type: 'Opsss...',
              title: message,
              description: message,
              key: 2
            })
          }
        }

      } else if (TradingAccountsIds?.length >= 2) {
        setIsLoading(true)
        const Params = {
          table_name: 'trading_accounts',
          table_ids: isCompleteSelect === "true" ? [] : TradingAccountsIds,
          ...formPayload
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (res !== undefined) {
            if (success) {
            setTradingAccount(initialValues)
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Trading Account Updated Successfully',
              key: 2
            })
            navigate('/trading-accounts')
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

      }
      else {
        setIsLoading(true)
        const res = await Update_Trading_Account(TradingAccountsIds[0], formPayload, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          setTradingAccount(initialValues)
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Trading Account Updated Successfully',
            key: 2
          })
          // navigate('/symbol-settings')
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
 
  const deleteHandler = ()=>{
    const Params = {
      table_name:'trading_accounts',
      table_ids: [ArrangedTradingAccountsData[currentIndex].id]
    }
    
    CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading )
    dispatch(deleteSymbolSettingsById(ArrangedTradingAccountsData[currentIndex].id))
    if(ArrangedTradingAccountsData?.length === 0 || ArrangedTradingAccountsData === undefined || ArrangedTradingAccountsData === null){
       navigate("/trading-accounts")
    }else{
      if(currentIndex < ArrangedTradingAccountsData?.length)
      handleNext()
      else
      handlePrevious()
    }
    

  }
  const items = [
    
    {
      key: '1',
      label: (
        <button rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
      disabled: CheckBrandPermission(userPermissions,userRole,'trading_account_list_update'),
    },
    {
      key: '2',
      label: (
        <button  rel="noopener noreferrer" onClick={deleteHandler} > Delete </button>
      ),
      disabled: CheckBrandPermission(userPermissions,userRole,'trading_account_list_delete'),
    },
   
  ];

  
  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/trading-accounts')

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
              onClick={() => navigate("/trading-accounts")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Trading Accounts List</h1> :
                <h1 className='text-2xl font-semibold'>{TradingAccountsIds?.length === 1 && parseInt(TradingAccountsIds[0]) === 0 ? 'Add Trading Account' : 'Edit Trading Account'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && TradingAccountsIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(TradingAccountsIds?.length === 1 && parseInt(TradingAccountsIds[0]) !== 0)  &&
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
              <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> <EllipsisOutlined /> </div>
          </Dropdown>
          </div>
          }
        
        </div>
        <div className='border rounded-lg p-4'>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
           
             { Control.map(val=>{
            const ComponentToRender = ComponentMap[val.control]
             const shouldDisplay =
            val.display === 'show' &&
            (userRole === 'admin' || (userRole === 'brand' && val.name !== 'brand'));

         return  shouldDisplay && (
              val.control === 'CustomAutocomplete'  ?(
            <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              variant={val.varient} 
              value={val.value}
              label={val.label}
              disabled={isDisabled}
              options={val?.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}
            </div>)

            :
              ( 
              <div key={val.id}>
              <ComponentToRender
              name={val.name} 
              varient={val.varient} 
              label={val.label}
               disabled={isDisabled}
              options={val?.options}
              value={val.value}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
            </div>
              )
            )})
          }


          </div>
          {
            !isDisabled &&  <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
            <CustomButton
              Text={ TradingAccountsIds?.length === 1 && parseInt(TradingAccountsIds[0]) === 0 ? 'Submit' : 'Update'}
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                zIndex: '100'
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
              onClickHandler={cancleHandler}
            />
          </div>
          }
         
        </div>
      </div>
    </Spin>
  )
}

export default TradingAccountsEntry
