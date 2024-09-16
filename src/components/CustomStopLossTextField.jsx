import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const CustomStopLossTextField = ({
  value,
  initialFromState,
  checkFirst,
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
  const isFirstClick = useRef(true);

  function incrementNumber(num) {
    let [integerPart, decimalPart] = num.split('.');
    // console.log('integral, decimal', integerPart, decimalPart)
    if (!decimalPart) {
      // console.log(parseInt(num) + 1)
      return parseInt(num) + 1;
    }
    let numZeros = decimalPart.length - 1;

    // Construct the result
    let newdecimalPart = parseFloat(`0.${'0'.repeat(numZeros)}1`);
    // console.log('newdecimalPart', newdecimalPart)
    // console.log('Integral Part', num)
    // console.log('newdecimalPart', typeof(newdecimalPart))
    // console.log('Integral Part', typeof(num))

    // Convert the string to a number and add it to the number
    let result = newdecimalPart + Number(num);

    // Format the result to have two digits after the decimal point
    result = result.toFixed(decimalPart.length);


    // console.log('newConverted', result)
    return result;
  }

  function decrementNumber(num) {
    let [integerPart, decimalPart] = num.split('.');
    if (!decimalPart) {
      // console.log(parseInt(num) - 1)
      return parseInt(num) - 1;
    }
    let numZeros = decimalPart.length - 1;

    // Construct the result
    let newdecimalPart = parseFloat(`0.${'0'.repeat(numZeros)}1`);
    // Convert the string to a number and add it to the number
    let result = Number(num) - newdecimalPart;

    // Format the result to have two digits after the decimal point
    result = result.toFixed(decimalPart.length);
    return result;
  }

  const handleChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9.]/g, '');
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setCurrentValue(newValue);
        onChange(newValue);
      }
    }
  };

  const handleIncrement = () => {
    // const newValue = parseFloat(event.target.value);
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      // if(currentValue === ""){
      //   setCurrentValue(0)
      // }
      const newValue = incrementNumber(`${currentValue === '' ? 0 : currentValue}`)
      // const newValue = currentValue + step;
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setCurrentValue(newValue)
        onChange(newValue);
      }
    }
  }

  const handleDecrement = () => {
    // const newValue = parseFloat(event.target.value);
    // const newValue = currentValue - step;
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      // if(currentValue === ""){
      //   setCurrentValue(0)
      // }
      // setCurrentValue((prevValue) => {
        const newValue = decrementNumber(`${currentValue === '' ? 0 : currentValue}`)
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue);
        setCurrentValue(newValue)
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
        value={value}
        inputProps={{ step, min, max, inputMode: 'numeric', pattern: '[0-9]*'}}
        InputLabelProps={{ shrink: currentValue !==null && currentValue !== '' }}
        onChange={handleChange}
        variant="standard"
        fullWidth={fullWidth}
        {...rest}
      />
      <div style={{
        marginLeft: '8px',
        fontSize: '24px',
        cursor: 'pointer',
      }}>
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
      </div>
    </div>
  );
};

CustomStopLossTextField.propTypes = {
  value: PropTypes.number,
  initialFromState: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

CustomStopLossTextField.defaultProps = {
  value: 0,
  label: 'Number',
  fullWidth: false,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 0.1
};

export default CustomStopLossTextField;
