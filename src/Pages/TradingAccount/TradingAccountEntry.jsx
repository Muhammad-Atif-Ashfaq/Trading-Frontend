import React, { useState } from 'react'
import { theme } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomButton from '../../components/CustomButton';
import { Link } from 'react-router-dom';

const TradingAccountEntry = () => {
  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();
  const [GroupList, setGroupList] = useState(AutocompleteDummyData)
  const [SelectedGroup, setSelectedGroup] = useState(null)
  const [CountryList, setCountryList] = useState(AutocompleteDummyData)
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [CreditList, setCreditList] = useState(AutocompleteDummyData)
  const [SelectedCredit, setSelectedCredit] = useState(null)
  const [MarginLevel, setMarginLevel] = useState(AutocompleteDummyData)
  const [SelectedMarginLevel, setSelectedMarginLevel] = useState(null)
  const [CurencyList, setCurencyList] = useState(AutocompleteDummyData)
  const [SelectedCurrency, setSelectedCurrency] = useState(null)
  const [CreditAccountGroup, setCreditAccountGroup] = useState(AutocompleteDummyData)
  const [SelectedCreditAccountGroup, setSelectedCreditAccountGroup] = useState(null)

  const Control = [
     {id: 1, control:'CustomTextField',  label:'Login ID', varient: 'standard'  },
     {id: 2, control:'CustomTextField',  label:'Name', varient: 'standard'  },
     {
        id: 3, 
        control:'CustomAutocomplete',
        name:'Group',   
        label:'Group', 
        varient: 'standard',
        options:GroupList,
        getOptionLabel:(option) => option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedGroup(value)
          }
          else{
              setSelectedGroup(null)
          } 
          }   
      },
      {
        id: 4, 
        control:'CustomAutocomplete',
        name:'Country',   
        label:'Country', 
        varient: 'standard',
        options:CountryList,
        getOptionLabel:(option) => option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedCountry(value)
          }
          else{
              setSelectedCountry(null)
          } 
          }   
      },
      {
        id: 5, 
        control:'CustomPhoneNo',
      }, 
      {id: 6, control:'CustomTextField',  label:'Email', varient: 'standard'  },
      {id: 7, control:'CustomTextField',  label:'Leverage', varient: 'standard'  },
      {id: 8, control:'CustomTextField',  label:'Balance', varient: 'standard'  },
      {
        id: 9, 
        control:'CustomAutocomplete',
        name:'Credit',   
        label:'Credit', 
        varient: 'standard',
        options:CreditList,
        getOptionLabel:(option) => option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedCredit(value)
          }
          else{
              setSelectedCredit(null)
          } 
          }   
      },
      {id: 9, control:'CustomTextField',  label:'Equity', varient: 'standard'  },
      {
        id: 10, 
        control:'CustomAutocomplete',
        name:'MarginLevel',   
        label:'Margin Level', 
        varient: 'standard',
        options:MarginLevel,
        getOptionLabel:(option) => option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedMarginLevel(value)
          }
          else{
              setSelectedMarginLevel(null)
          } 
          }   
      },
      {id: 10, control:'CustomTextField',  label:'Profit', varient: 'standard'  },
      {id: 11, control:'CustomTextField',  label:'Swap', varient: 'standard'  },
      {
        id: 12, 
        control:'CustomAutocomplete',
        name:'Currency',   
        label:'Currency', 
        varient: 'standard',
        options:CurencyList,
        getOptionLabel:(option) => option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedCurrency(value)
          }
          else{
              setSelectedCurrency(null)
          } 
          }   
      },
      {id: 12, control:'CustomTextField',  label:'Registration Time', varient: 'standard'  },
      {id: 13, control:'CustomTextField',  label:'Last Access Time', varient: 'standard'  },
      {id: 14, control:'CustomTextField',  label:'Last Access IP', varient: 'standard'  },
      {
        id: 15, 
        control:'CustomAutocomplete',
        name:'CreditAccountGroup',   
        label:'Credit Account Group', 
        varient: 'standard',
        options:CreditAccountGroup,
        getOptionLabel:(option) => option.title ? option.title : "",
        onChange:(e,value) =>{
          if(value){
              setSelectedCreditAccountGroup(value)
          }
          else{
              setSelectedCreditAccountGroup(null)
          } 
          }   
      },
  ]

  const ComponentMap = {
    CustomTextField: CustomTextField,
    CustomAutocomplete: CustomAutocomplete,
    CustomPhoneNo: CustomPhoneNo,
  };

  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Trading Account</h1>
      </div>
        <div className='bg-white border rounded-lg mt-6 p-4'>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {
            Control.map(val=>{
            const ComponentToRender = ComponentMap[val.control]
            return (
              <ComponentToRender
              name={val.name} 
              varient={val.varient} 
              label={val.label}
              options={val.options}
              getOptionLabel={(option) => val.getOptionLabel(option)}
              onChange={(e,value) => val.onChange(e,value)} 
              />
              )
            })
          }
           
             
        </div>
        <div className='flex items-center justify-end gap-8'>
          <Link to='/trading-accounts'>
              <CustomButton
                Text={'Cancle'}
                style={{
                    width: '180px',
                    height: '48px',
                    padding: '8px, 16px, 8px, 16px',
                    radius: '6px',
                    marginTop: '16px',
                }}
                backgroundColor={Gray2}
                borderColor={Gray2}
              />
            </Link>
              <CustomButton
                Text={'Update'}
                style={{
                    width: '180px',
                    height: '48px',
                    padding: '8px, 16px, 8px, 16px',
                    radius: '6px',
                    marginTop: '16px',
                }}
              />
        </div>
      </div>
    </div>
  )
}

export default TradingAccountEntry