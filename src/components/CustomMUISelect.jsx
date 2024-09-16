import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const CustomMUISelect = () => {
  const [country, setCountry] = useState('');

  const handleChangeCountry = (event) => {
    setCountry(event.target.value);
  };

  return (
    <div className="flex items-center">
      <FormControl variant="standard" sx={{ width: 70 }}>
        <InputLabel id="country-label">Country</InputLabel>
        <Select
          labelId="country-label"
          id="country"
          value={country}
          onChange={handleChangeCountry}
        >
          <MenuItem value="USA">USA</MenuItem>
          <MenuItem value="UK">UK</MenuItem>
          <MenuItem value="Canada">Canada</MenuItem>
          {/* Add more countries as needed */}
        </Select>
      </FormControl>
      <TextField
        label="Amount"
        type="number"
        variant="standard"
        className="ml-2"
        fullWidth
        // Add your props and state for TextField as needed
      />
      {/* Add a button or any other controls as needed */}
    </div>
  );
};

export default CustomMUISelect;
