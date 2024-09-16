import React from 'react'
import CustomTextField from '../../components/CustomTextField'
import { numberInputStyle } from './style'

const TradePrice = ({openPrice, askPrice, label}) => {
  return (
    <div className="flex-1">
                  <CustomTextField 
                    label={label} 
                    // value={`${openPrice} / ${askPrice}`} 
                    value={askPrice} 
                    // type="number" 
                    sx={numberInputStyle}
                    varient={'standard'}  
                    // onChange={e => handleInputChange('open_price', e.target.value)}
                  />
                </div>
  )
}

export default TradePrice