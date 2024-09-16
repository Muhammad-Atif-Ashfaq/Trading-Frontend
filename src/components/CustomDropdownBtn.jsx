import React from 'react';
import {Dropdown} from 'antd';


const CustomDropdownBtn = ({ Text, menuProps, width }) => (
  <Dropdown.Button menu={menuProps} className={`w-[${width}px]`} >
    {Text}
  </Dropdown.Button>
);
export default CustomDropdownBtn;