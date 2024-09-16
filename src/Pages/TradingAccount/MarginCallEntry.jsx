import React, { useState, useEffect } from 'react';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import { Save_Trading_Account } from '../../utils/_TradingAPICalls';
import { ToastContainer } from 'react-toastify';
import { CurrenciesList,Countries } from '../../utils/constants';
import CustomNotification from '../../components/CustomNotification';
import { Spin } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { useSelector } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import { GetAllBrandsCustomerList, GetBrandsList } from '../../utils/_BrandListAPI';
import { TradingAccountValidationSchema } from '../../utils/validations';
import { ALL_Trading_Account_Group_List } from '../../utils/_TradingAccountGroupAPI';


const MarginCallEntry = ({ setIsModalOpen, fetchTradingAccounts, TradingAccountID, page }) => {
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name);
  const userBrand = useSelector((state) => state?.user?.user?.brand)
  const token = useSelector(({ user }) => user?.user?.token)
  const [brandList, setBrandList] = useState([])
  const [brandCustomerList, setBrandCustomerList] = useState([])
  const [tradingAccountGroupList, setTradingAccountGroupList] = useState([])
  const [SelectedCountry,SetSelectedCountry] = useState(null)

  const getBrandsList = async () => {
    setIsLoading(true)
    const res = await GetBrandsList(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setBrandList(payload)
      // setTradingAccount((prev)=> ({
      //   ...prev, leverage: payload.leverage
      // }))
    }
  }

  const getAllBrandsCustomerList = async (public_key) => {
    setIsLoading(true)
    const res = await GetAllBrandsCustomerList(token, public_key)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {
      setBrandCustomerList(payload)
    }
  }

  const fetchTradingAccountGroups = async () => {
    setIsLoading(true)
    const group_response = await ALL_Trading_Account_Group_List(token)
    const { data: { payload, success } } = group_response
    setIsLoading(false)
    if (success) {
      setTradingAccountGroupList(payload)
     
    }

  }


  useEffect(() => {
    fetchTradingAccountGroups()
    if (userRole === 'admin') {
      getBrandsList()
    }
    if (userRole !== 'admin') {
      getAllBrandsCustomerList(userBrand.public_key)
    }
  }, [])


  const initialValues = {
    country: null,
    phone: "",
    email: "",
    // balance: "",
    name:"",
    leverage: "",
    // swap: "",
    currency: "",
    brand_id: "",
    brand_customer_id: "",
    trading_group_id: "",
    status: "active"
  }


  const [tradingAccount, setTradingAccount] = useState(initialValues)

  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)




  const Control = [

    {
      id: 1,
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
      id: 2,
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
      id: 3, control: 'CustomTextField', display: 'show', label: 'Email', required: true, varient: 'standard', value: tradingAccount.email, onChange: (e) => {
        setTradingAccount(prevData => ({
          ...prevData,
          email: e.target.value
        }));
      }
    },
    {
      id: 4,
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
      id: 5,
      control: 'CustomAutocomplete',
      display: 'show',
      name: 'Country',
      label: 'Country',
      required: true,
      varient: 'standard',
      options: Countries,
      value: tradingAccount.country,
      getOptionLabel: (option) => option.label ? option.label : "",
      onChange: (e, value) => {
        if (value) {
          setErrors(prevErrors => ({ ...prevErrors, country: "" }))
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

    // {
    //   id: 6, control: 'CustomTextField', display: 'show', label: 'Balance', varient: 'standard', value: tradingAccount.balance, onChange: (e) => {

    //     setTradingAccount(prevData => ({
    //       ...prevData,
    //       balance: e.target.value
    //     }))
    //   }
    // },
    {
      id: 7, control: 'CustomTextField', display: 'show', label: 'Name', varient: 'standard', value: tradingAccount.name, onChange: (e) => {

        setTradingAccount(prevData => ({
          ...prevData,
          name: e.target.value
        }))
      }
    },
    // {
    //   id: 8, control: 'CustomTextField', display: 'show', label: 'Swap', required: true, varient: 'standard', value: tradingAccount.swap, onChange: (e) => {

    //     setTradingAccount(prevData => ({
    //       ...prevData,
    //       swap: e.target.value
    //     }))
    //   }
    // },
    {
      id: 9,
      control: 'CustomAutocomplete',
      name: 'Currency',
      display: 'show',
      label: 'Currency',
      required: true,
      varient: 'standard',
      options: CurrenciesList,
      value: tradingAccount.currency,
      getOptionLabel: (option) => option.label ? option.label : "",
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
      id: 10,
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
      id: 11,
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


  const handleSubmission = async () => {
    try {

      //  await TradingAccountValidationSchema.validate({
      //   brand_id,
      //   leverage
      // }, { abortEarly: false });
      // setErrors({});
      const selectedBrand =  brandList?.find((brand)=>brand?.public_key === tradingAccount?.brand_id?.public_key)

      const formPayload = {
        ...tradingAccount,
        country:tradingAccount?.country?.label,
        brand_id:userRole === 'admin' ? selectedBrand.public_key :userBrand.public_key,
        margin_level_percentage:userRole === 'admin' ? selectedBrand.margin_call :userBrand.margin_call,
        leverage: tradingAccount.leverage?.value,
        currency: tradingAccount.currency?.value,
        brand_customer_id: tradingAccount.brand_customer_id?.id,
        trading_group_id: tradingAccount.trading_group_id?.id,
      }

      setIsLoading(true)
      const res = await Save_Trading_Account(formPayload, token)
      const SymbolSettingIds = useSelector(({ symbolSettings }) => symbolSettings.selectedRowsIds)
      const SymbolSettingsData = useSelector(({symbolSettings})=> symbolSettings.symbolSettingsData)
      const ArrangedSymbolSettingsData = SymbolSettingsData;

      const { data: { message, payload, success } } = res
      setIsLoading(false)
      if (success) {
        console.log('success message', message)

        setTradingAccount(prevData => ({ ...prevData, ...initialValues }))
        CustomNotification({ type: "success", title: "Trading Account", description: message, key: 1 })
        setIsModalOpen(false)

        if (userRole === 'brand') {
          fetchTradingAccounts(userBrand.public_key, page)
        }
        else {
          fetchTradingAccounts(null, page)
        }

      } else {
        CustomNotification({ type: "error", title: "Trading Account", description: message, key: 1 })


      }

    } catch (err) {
      CustomNotification({ type: "error", title: "Trading Account", description: err.message, key: 1 })


    }
  }


  const handleSubmit = () => {
    {
      (tradingAccount.email === '' || tradingAccount.currency === '' || tradingAccount.leverage === '' 
      // ||tradingAccount.swap === '' 
       || (userRole === 'admin' && tradingAccount.brand_id === '')) ? CustomNotification({ type: "error", title: "Add New Trading Account", description: 'Please fill all the required fields', key: 1 })
        : handleSubmission()
    }
  };


  const cancleHandler= ()=>{
    if(isDisabled){
      navigate('/margin-calls')

    }else{
      setIsDisabled(true)
    }
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='flex flex-col gap-6'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {Control.map(val => {
            const ComponentToRender = ComponentMap[val.control]
            const shouldDisplay =
              val.display === 'show'
              &&
              (userRole === 'admin' || (userRole === 'brand' && val.name !== 'brand'));

            return shouldDisplay && (
              val.control === 'CustomAutocomplete' ? (
                <div key={val.id}>
                  <ComponentToRender
                    name={val.name}
                    variant={val.varient}
                    label={val.label}
                    required={val.required}
                    options={val.options}
                    value={val.value}
                    getOptionLabel={(option) => val.getOptionLabel(option)}
                    onChange={(e, value) => val.onChange(e, value)}
                  />
                  {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}

                  {/* <CustomAutocomplete
                name='Leverage'
                variant='standard'
                label='Select Leverage'
                disabled={isDisabled}
                options={LeverageList}
                getOptionLabel={(option) => option.title ? option.title : ""}
                value={SelectedLeverage}
                onChange={(e, value) => {
                  if (value) {
                    setSelectedLeverage(value);
                    setErrors(prevErrors => ({ ...prevErrors, Leverage: '' }));
                  } else {
                    setSelectedLeverage(null);
                    setErrors(prevErrors => ({ ...prevErrors, Leverage: 'Leverage is Requried' }));
                  }
                }}
              /> */}
                </div>)

                :
                (
                  <div key={val.id}>
                    <ComponentToRender
                      name={val.name}
                      varient={val.varient}
                      label={val.label}
                      required={val.required}
                      options={val.options}
                      getOptionLabel={(option) => val.getOptionLabel(option)}
                      onChange={(e, value) => val.onChange(e, value)}
                    />
                    {errors.symbol && <span style={{ color: 'red' }}>{errors.symbol}</span>}
                  </div>
                )
            )
          })
          }


{
            !isDisabled &&  <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
            <CustomButton
              Text={ SymbolSettingIds.length === 1 && parseInt(SymbolSettingIds[0]) === 0 ? 'Submit' : 'Update'}
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

          {/* <div style={footerStyle}>
            <CustomButton
              Text={'Submit'}
              style={submitStyle}
              onClickHandler={handleSubmit}
            />
          </div> */}

        </div>
        <ToastContainer />
      </div>
    </Spin>
  );
};

export default MarginCallEntry;
