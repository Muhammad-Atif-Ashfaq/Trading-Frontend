import React, { useState } from 'react';
import { theme, Checkbox, } from 'antd';
import styled, { css } from "styled-components";

import CoinCard from './CoinCard';
import { DashboardCardData } from '../../utils/constants';
import CandleChart from '../../components/CandleChart';
import CustomTable from '../../components/CustomTable';
import CustomDropdownBtn from '../../components/CustomDropdownBtn';
import CustomTextField from '../../components/CustomTextField';
import { SearchOutlined } from '@ant-design/icons';
const VerticalCheckboxGroup = styled(Checkbox.Group)`
  ${(props) =>
    props.backgroundColor &&
    css`
      &  .ant-checkbox-group-item {
        display: flex;
        align-items: center;
        height: 32px;
        margin-right: 0;
      }
      ,
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${props.backgroundColor};
        border-color: ${props.backgroundColor};
      }
    `}
`;
const Index = () => {
  const { token: { colorBG, colorPrimary, TableHeaderColor } } = theme.useToken();
  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: '1',
    },
    {
      title: 'Currency',
      dataIndex: 'name',
      key: '2',
    },
    {
      title: 'Leverage',
      dataIndex: 'age',
      key: '3',
    },
    {
      title: 'Balance',
      dataIndex: 'address',
      key: '4',
    },
    {
      title: 'Account Type',
      dataIndex: 'type',
      key: '5',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '6',
      render: (text) => <span className='p-2 rounded-full text-white' style={{ backgroundColor: colorPrimary }}>{text}</span>,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'USD',
      age: '50:1',
      address: '$100,000',
      type: 'Standard',
      status: 'Active',
    },
    {
      key: '2',
      name: 'EUR',
      age: '30:1',
      address: '€80,000',
      type: 'Premium',
      status: 'Inactive',
    },
  ];

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const handleMenuClick = (e) => { };

  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  const columnMenuProps = {
    items: columns.map((column) => ({
      key: column.key,
      icon: (
        <VerticalCheckboxGroup
          value={checkedList}
          options={[{ label: column.title, value: column.key }]} // Use the column title as label and key
          onChange={(value) => {
            const newCheckedList = [...checkedList];
            if (value.includes(column.key)) {
              newCheckedList.push(column.key);
            } else {
              const index = newCheckedList.indexOf(column.key);
              if (index !== -1) {
                newCheckedList.splice(index, 1);
              }
            }
            setCheckedList(newCheckedList);
          }}
          backgroundColor={colorPrimary}
        />
      ),
    })),
    onClick: handleMenuClick,
  };
  return (
    <div className='p-8 w-full' style={{ backgroundColor: colorBG }}>
      {/* <h1 className='text-2xl font-semibold py-12px'>Dashboard</h1> */}
      {/* <div className="grid w-full gap-4  lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
        {DashboardCardData.map((item) => (
          <CoinCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            value={item.value}
            subvalue={item.subvalue}
            img_url={item.img_url}
            graph_url={item.graph_url}
            subvalue_color={item.subvalue_color}
          />
        ))}
      </div> */}
      <div className='my-8 flex justify-between items-center' >
        <div>
          <h1 className='text-2xl font-semibold mb-8'>Reports</h1>
        </div>
        <div>
          <CustomTextField label={<>
            <SearchOutlined />
            &nbsp;Search for an entry
          </>} />
        </div>
      </div>
      <CandleChart />
      {/* <div className='bg-white p-4 border rounded-lg'>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Trading Account</h1>
          <div>
            <CustomDropdownBtn Text='Manage Columns' menuProps={columnMenuProps} />
          </div>
        </div>
        <CustomTable columns={newColumns} data={data} headerStyle={headerStyle} />
      </div> */}
    </div >
  );
};

export default Index;
