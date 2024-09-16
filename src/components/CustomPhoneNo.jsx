import React from 'react'
import { MuiTelInput } from 'mui-tel-input'

const CustomPhoneNo = ({value, required=false,onChange,label,...props}) => {
 
  return <MuiTelInput
    value={value}
    defaultCountry="PK"
    label = {label}
    onChange={onChange}
    required={required}
    variant= 'standard'
    style={{
    marginTop: '15px',
    width:"100%"
    }}
    {...props}
    />
}
export default CustomPhoneNo