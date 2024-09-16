import React, { useState } from 'react';
import { theme,Checkbox, Select, Input } from 'antd';
import Highcharts from 'highcharts'
import HighchartsReact  from 'highcharts-react-official'
import styled, {css} from "styled-components";
import CustomSelect from '../../components/CustomSelect';
import CandleChart from '../../components/CandleChart';
import CustomButton from '../../components/CustomButton';
import BrandDD from './BrandDD';
import { BarChartConfig } from '../../utils/constants';

import FILTER_CDN from '../../assets/images/filter-white.svg';
import { ChartStyle, FilterBtnStyle } from './style';


const Index = () => {
  const {
    token: { colorBG,colorPrimary, TableHeaderColor  },
  } = theme.useToken();
  
const onChange = (value) => {
  console.log(`selected ${value}`);
};

const onSearch = (value) => {
  console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
      <div className='flex justify-between'>
       <h1 className='text-2xl font-semibold py-12px'>Reports</h1>
       <div className='flex'>
       <Select
    showSearch
    placeholder="By Profile"
    optionFilterProp="children"
    onChange={onChange}
    onSearch={onSearch}
    filterOption={filterOption}
    bordered={false}
    style={{border: "1px solid #d1d1d1", width:"90px", height:"48px"  }}
    dropdownRender={()=> <BrandDD />}
    options={[
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
      {
        value: 'tom',
        label: 'Tom',
      },
    ]}
  />
  <Input placeholder="Search for an entry" />
      </div>
      </div>
      <div className='my-8'>
        <CandleChart />
      </div>
      <div className='flex justify-between'>
       <h1 className='text-2xl font-semibold py-12px'>Trading Orders</h1>
       <CustomButton
          Text={'Filters'}
          icon={<img src={FILTER_CDN} alt='icon' />}
          style={FilterBtnStyle}
        />
      </div>
      <div className='flex justify-between gap-4'>
      <div className="w-full flex-grow lg:col-span-1 md:col-span-2 bg-white border rounded-lg p-4">
      <div className="flex flex-col justify-between w-full">
        <h3 className='text-lg font-bold p-2'></h3>Trading Order by Number
        <div className='flex flex-row gap-1'>
          <span className='text-sm font-medium p-2'>Date Range:</span>
          <CustomSelect width={'120px'} />
        </div>
      </div>
      <div className="w-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={BarChartConfig}
          containerProps={{ style: ChartStyle }}
        />
      </div>
      </div>
      <div className="w-full flex-grow lg:col-span-1 md:col-span-2 bg-white border rounded-lg p-4">
      <div className="flex flex-col justify-between w-full">
        <h3 className='text-lg font-bold p-2'>Trading Volumn by lots</h3>
        <div className='flex flex-row gap-1'>
          <span className='text-sm font-medium p-2'>Date Range:</span>
          <CustomSelect width={'120px'} />
        </div>
      </div>
      <div className="w-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={BarChartConfig}
          containerProps={{ style: ChartStyle }}
        />
      </div>
      </div>
      </div>
    </div>
  )
}

export default Index