import React, {  useState,useEffect } from 'react';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import {  Save_Trading_Account } from '../../utils/_TradingAPICalls';
import { notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';

import CustomNotification from '../../components/CustomNotification';
import { Spin } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';

import { useSelector } from 'react-redux';
import { GetBrandsList } from '../../utils/_BrandListAPI';


const CreateTradingAccountModal = ({ setIsCreateModalOpen, fetchTradingAccounts}) => {
  const token = useSelector(({user})=> user?.user?.token )
  const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
const userBrand = useSelector((state)=> state?.user?.user?.brand)
  
  
  const [tradingAccount,setTradingAccount] = useState() 
   const [brandList,setBrandList] = useState([])
   const [selectedBrand,setSelectedBrand] =  useState(null)

  const [isLoading, setIsLoading] = useState(false)

 
const getBrandsList = async () =>{
    setIsLoading(true)
    const res = await GetBrandsList(token)
    const { data: { success, message, payload } } = res
    setIsLoading(false)
    if (success) {

      setBrandList(payload)

       
    }
  }

  useEffect(()=>{
    if(userRole  === 'admin'){
    getBrandsList()
    }
 
  },[])
 




  const handleSubmit = async () => {
    try {
     setIsLoading(true)
     const res = await Save_Trading_Account({brand_id:selectedBrand.public_key}, token)
     const {data: {message, payload, success}} = res
     setIsLoading(false)
        if(success){
          console.log('success message',message)
          setTradingAccount(prevData=>({...prevData}))
          notifySuccess(message)
          setIsCreateModalOpen(false)
          fetchTradingAccounts()
        
        }else{
          notifyError(payload.trading_group_id[0]) 
        }      
     
    }catch (err) {
     
       notifyError(err) 
    }
  };


 

  return (
    <Spin spinning={isLoading} size="large">
    <div className='flex flex-col gap-6'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomAutocomplete
              name='brandsList'
              variant='standard'
              label='Select Brands'
              options={brandList}
              getOptionLabel={(option) => option?.name ? option?.name : ""}
              value={ selectedBrand} 
              onChange={(e, value) => {
                if (value) {
                  setSelectedBrand(value);
                } else {
                  setSelectedBrand(null);
                }
              }}
            />
            <CustomButton
            Text={'Submit'}
            style={submitStyle}
            onClickHandler={handleSubmit}
          /> 
        </div>
         <ToastContainer />
    </div>
    </Spin>
  );
};

export default CreateTradingAccountModal;
