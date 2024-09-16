import { TextField } from '@mui/material'
import React from 'react'

const CustomTextField = ({ label, required=false, varient, multiline, rows, type, value, className, sx, onChange, disabled, InputProps, s_value=true}) => {
  return (
    <TextField
      type={type}
      id="standard-basic"
      label={label}
      required={required}
      variant={varient}
      multiline={multiline}
      InputProps= {InputProps}
      rows={rows}
      value={value}
      className={className}
      sx={sx}
      disabled={disabled}
      onChange={onChange}
       inputMode="off"
      // InputLabelProps={{ shrink: s_value }} // Use InputLabelProps to pass shrink prop
      // shrink = {true}
      fullWidth
      
    />
  )
}

export default CustomTextField