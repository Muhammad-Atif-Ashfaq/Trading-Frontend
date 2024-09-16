import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const CustomAutocomplete = ({ name, id, defaultValue,options, required=false, getOptionLabel,getOptionSelected, onChange, variant, label, multiple, disabled, value }) => {
  return (
    <Autocomplete
      multiple={multiple}
      name={name}
      id={id}
      variant= {variant}
      defaultValue={defaultValue && defaultValue}
      disabled = {disabled}
      options={options}
      value={value}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} label={label} required={required} name={name} variant={variant} />}
      fullWidth
    />
  );
};

export default CustomAutocomplete;
