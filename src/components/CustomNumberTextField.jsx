import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import CustomNotification from './CustomNotification';

const CustomNumberTextField = ({
  value,
  initialFromState,
  // checkFirst,
  onChange,
  label,
  fullWidth,
  min,
  max,
  step,
  ...rest
}) => {

  useEffect(() => {
      setCurrentValue(value);
  }, [value]);
  
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState('');
  const isFirstClick = useRef(true);

  // Function to perform arithmetic operations (addition or subtraction) with a specified precision
  function operateWithPrecision(num1, num2, operation) {
    // Determine the precision based on the maximum precision of the two numbers
    var precision = Math.max(getPrecision(num1), getPrecision(num2));

    // Calculate the multiplier to shift the decimal point to preserve precision
    var multiplier = Math.pow(10, precision);

    // Scale the numbers to the same precision
    var scaledNum1 = Math.round(num1 * multiplier);
    var scaledNum2 = Math.round(num2 * multiplier);

    // Perform the operation
    var result;
    if (operation === 'add') {
      result = (scaledNum1 + scaledNum2) / multiplier;
    } else if (operation === 'subtract') {
      result = (scaledNum1 - scaledNum2) / multiplier;
    } else {
      throw new Error('Unsupported operation. Only "add" or "subtract" are allowed.');
    }

    // Return the result
    return result;
  }

  // Function to get the precision of a number
  function getPrecision(num) {
    // Convert the number to a string and split it into integer and fractional parts
    var parts = num.toString().split('.');
    // Return the length of the fractional part, or 0 if there's no fractional part
    return parts[1] ? parts[1].length : 0;
  }


  const handleChange = (event) => {
    const newValue = event.target.value;
    if (!isNaN(newValue)) {
      if (parseFloat(newValue) >= min && parseFloat(newValue) <= max) {
        setCurrentValue(newValue);
        onChange(newValue);
        setError('');
      } else {
        setCurrentValue(newValue);
        setError(`${newValue} is outside the valid range [${min}, ${max}]`);
        CustomNotification({ type: "error", title: "Live Order", description: `${newValue} is outside the valid range [${min}, ${max}]`, key: 1 });
      }
    } else {
      setCurrentValue(newValue);
      setError(`${newValue} is an Invalid Value`);
      CustomNotification({ type: "error", title: "Live Order", description: `${newValue} is an Invalid Value`, key: 1 });
    }
    // const newValue = event.target.value;
    // // const even = parseFloat(parseFloat(newValue) % 2).toFixed(2)
    // const rem = parseFloat(parseFloat(newValue) % step).toFixed(2)
    // if (!isNaN(newValue) && (parseFloat(newValue) === max || (parseFloat(newValue) >= min && parseFloat(newValue) <= max && parseFloat(rem) === min))) {
    //   setCurrentValue(newValue);
    //   onChange(newValue)
    //   setError('');
    // }
    // else {
    //   setCurrentValue(newValue);
    //   // alert('invalid value')
    //   setError(`${newValue} is an Invalid Value`);
    //   CustomNotification({ type: "error", title: "Live Order", description: `${newValue} is an Invalid Value`, key: 1 })
    // }
    // if (isFirstClick.current) {
    //   if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
    //     setCurrentValue(initialFromState);
    //     isFirstClick.current = false;
    //     onChange(initialFromState);
    //   }
    // } else {
    //   if (!isNaN(newValue) && newValue >= min && newValue <= max) {
    //     setCurrentValue(newValue);
    //     onChange(newValue);
    //   }
    // }
  };

  const handleIncrement = () => {
    // const newValue = parseFloat(event.target.value);
    if (isFirstClick.current) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      const newValue = operateWithPrecision(currentValue, step, 'add')
      // const newValue = currentValue + step;
      if (!isNaN(newValue) && newValue > max) {
        setCurrentValue(max)
        onChange(max);
      }
      if(!isNaN(newValue) && newValue >= min && newValue <= max) {
        setCurrentValue(newValue)
        onChange(newValue);
        setError('');
      }
    }
  }

  const handleDecrement = () => {
    // const newValue = parseFloat(event.target.value);
    // const newValue = currentValue - step;
    const newValue = operateWithPrecision(currentValue, step, 'subtract')
    if (isFirstClick.current) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      // setCurrentValue((prevValue) => {
        if (!isNaN(newValue) && newValue < min) {
          setCurrentValue(min)
          onChange(min);
        }
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue);
        setCurrentValue(newValue)
        setError('');
        // return newValue;
      }
      // else {
      //   return prevValue;
      // }
      // });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        type="text"
        label={label}
        value={currentValue}
        inputProps={{ step, min, max }}
        onChange={handleChange}
        variant="standard"
        fullWidth={fullWidth}
        error={!!error}
        helperText={error}
        {...rest}
      />
      <div style={{
        marginLeft: '8px',
        fontSize: '24px',
        cursor:'pointer',
      }}>
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
      </div>
    </div>
  );
};

CustomNumberTextField.propTypes = {
  value: PropTypes.number,
  initialFromState: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

CustomNumberTextField.defaultProps = {
  value: 0,
  label: 'Number',
  fullWidth: false,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 0.1
};

export default CustomNumberTextField;
