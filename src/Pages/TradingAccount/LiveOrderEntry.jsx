import { theme } from 'antd';
import React, { useState } from 'react'

import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomButton from '../../components/CustomButton';
import CustomCheckbox from '../../components/CustomCheckbox';

const LiveOrderEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const [SymbolList, setSymbolList] = useState(AutocompleteDummyData)
  
  const [SelectedSymbol, setSelectedSymbol] = useState(null)

  const [TypeList, setTypeList] = useState([
    { id: 1, title: 'Pending Order' },
    { id: 2, title: 'Market Order' },
  ])
  const [SelectedType, setSelectedType] = useState(null)

  const [LimitTypeListPO, setLimitTypeListPO] = useState([
    { id: 1, title: 'Buy Limit' },
    { id: 2, title: 'Sell Limit' },
    { id: 3, title: 'Buy Stop' },
    { id: 5, title: 'Sell Stop' },
    { id: 6, title: 'Buy Sell Limit' },
    { id: 7, title: 'Sell Stop Limit' },
  ])
  const [SelectedLimitTypeListPO, setSelectedLimitTypeListPO] = useState(null)

  const Controls = [
    {
      id: 1,
      control: 'CustomAutocomplete',
      name: 'Symbol',
      label: 'Symbol',
      varient: 'standard',
      options: SymbolList,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        if (value) {
          setSelectedSymbol(value)
        }
        else {
          setSelectedSymbol(null)
        }
      }
    },
    { id: 2, control: 'CustomTextField', label: 'Time', varient: 'standard' },
    {
      id: 3,
      control: 'CustomAutocomplete',
      name: 'Type',
      label: 'Type',
      varient: 'standard',
      options: TypeList,
      getOptionLabel: (option) => option.title ? option.title : "",
      onChange: (e, value) => {
        if (value) {
          setSelectedType(value)
        }
        else {
          setSelectedType(null)
        }
      }
    },
    { id: 4, control: 'CustomTextField', label: 'Volumn', varient: 'standard' },
    { id: 5, control: 'CustomTextField', label: 'Price', varient: 'standard' },
    { id: 6, control: 'CustomTextField', label: 'Stop Loss', varient: 'standard' },
    { id: 7, control: 'CustomTextField', label: 'Take Profit', varient: 'standard' },
    { id: 8, control: 'CustomTextField', label: 'Price', varient: 'standard' },
    { id: 9, control: 'CustomTextField', label: 'Profit', varient: 'standard' },
  ]

  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
  };

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex gap-3'>
        <img
          src={ARROW_BACK_CDN}
          alt='back icon'
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <h1 className='text-3xl font-bold'>Trading Account</h1>
      </div>
      <div className='border border-gray-300 mt-4 p-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          {
            Controls.map(val => {
              const ComponentToRender = ComponentMap[val.control]
              if (val.id === 5) {
                return (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CustomTextField label={'Price'} varient={'standard'} />
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2 md:w-1/2 mt-4">
                        <CustomButton style={{
                          backgroundColor: colorTransparentPrimary,
                          borderColor: colorTransparentPrimary,
                          color: 'black',
                          fontWeight: 'bold',
                          borderRadius: 8
                        }} Text={'Update'} />
                        <CustomCheckbox />
                        <label className='mt-2'>Auto</label>
                      </div>
                    </div>
                  </div>
                )
              } else {
                return (
                  <ComponentToRender
                    name={val.name}
                    varient={val.varient}
                    label={val.label}
                    options={val.options}
                    value={val.value}
                    getOptionLabel={(option) => val.getOptionLabel(option)}
                    onChange={(e, value) => val.onChange(e, value)}
                  />
                )
              }

            })
          }
        </div>
        <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
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
            onClickHandler={()=> navigate(-1)}
          />
          <CustomButton
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
          />

        </div>
      </div>
    </div>
  )
}

export default LiveOrderEntry