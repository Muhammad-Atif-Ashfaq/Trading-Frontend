import React from 'react';
import { Select } from 'antd';
import { GrowthChartFilter } from '../utils/constants';
const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
const CustomSelect = ({width}) => (
  <Select
    showSearch
    placeholder="Filter"
    optionFilterProp="children"
    onChange={onChange}
    onSearch={onSearch}
    filterOption={filterOption}
    options={GrowthChartFilter}
    style={{width:width }}
  />
);
export default CustomSelect;