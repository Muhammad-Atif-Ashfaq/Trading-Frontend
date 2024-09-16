import React, { useEffect, useState } from 'react';
import CustomTextField from '../../components/CustomTextField';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { GetSingleBrand, SaveBrands, UpdateBrand } from '../../utils/_APICalls';
import { LeverageList, notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { Spin } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';

const BrandModal = ({ setIsModalOpen, fetchBrands, BrandID }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [disabledDomain, setDisabledDomain] = useState(false);
  const [marginCall, setMarginCall] = useState('');
  const [leverage, setLeverage] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        name,
        domain,
        marginCall,
        leverage
      }, { abortEarly: false });

      setErrors({});
      const BrandData = {
        name: name,
        domain: domain,
        margin_call: marginCall,
        leverage: leverage.value
      }
      if (BrandID === 0) {
        setIsLoading(true)
        
        const res = await SaveBrands(BrandData, token)
        const { data: { message, payload, success } } = res
        setIsLoading(false)
        if (success) {
          notifySuccess(message)
          setIsModalOpen(false)
          fetchBrands()
          clearFields()
        } else {
          notifyError(message)
        }
      } else {
        setIsLoading(true)
        const res = await UpdateBrand(BrandID, BrandData, token)
        const { data: { message, payload, success } } = res
        setIsLoading(false)
        if (success) {
          notifySuccess(message)
          setIsModalOpen(false)
          fetchBrands()
          clearFields()
        } else {
          notifyError(message)
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

  useEffect(() => {
    clearFields()
    if (BrandID !== 0) { // update
      setDisabledDomain(true)
      fetchDataWRTID()
    } else {
      setDisabledDomain(false)
    }
  }, [BrandID])

  const fetchDataWRTID = async () => {
    setIsLoading(true)
    const res = await GetSingleBrand(BrandID, token)
    const { data: { payload, message, success } } = res
    setIsLoading(false)
    if (success) {
      setName(payload.name)
      setDomain(payload.domain)
      setMarginCall(payload.margin_call)
      setLeverage(payload.leverage)
    } else {
      notifyError(message)
    }
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='flex flex-col gap-6'>

        {/* <Typography></Typography> */}


        <CustomTextField
          label="Name"
          varient="standard"
          type="text"
          value={name}
          onChange={e => handleInputChange('name', e.target.value)}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

        <CustomTextField
          label="Domain"
          varient="standard"
          type="text"
          disabled={disabledDomain}
          value={domain}
          onChange={e => handleInputChange('domain', e.target.value)}
        />
        {errors.domain && <span style={{ color: 'red' }}>{errors.domain}</span>}

        <CustomTextField
          label="Margin Call"
          varient="standard"
          type="number"
          InputProps={{
            inputProps: { min: 1, max: 100 },
          }}
    
          value={marginCall}
          onChange={e => {
            if(e.target.value >= 0 && e.target.value <= 100){
              handleInputChange('marginCall', e.target.value)
            }
            
          }}
          
        />
        {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}

        <CustomAutocomplete
          label="Select Leverage"
          name='Leverage'
          variant="standard"
          options={LeverageList}
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
       
        <div style={footerStyle}>
          <CustomButton
            Text={ BrandID === 0 ? 'Submit' :'Update'}
            style={submitStyle}
            onClickHandler={handleSubmit}
          />
          
        </div>

        
          
     

        <ToastContainer />
      </div>
    </Spin>
  );
};

export default BrandModal;
