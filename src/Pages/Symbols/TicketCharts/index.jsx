import React, { useState } from 'react'
import { theme } from 'antd';
import CustomTable from '../../../components/CustomTable';
import { useSelector } from 'react-redux';
import { Ticket_Chart } from '../../../utils/BackendColumns';
import { Export_Ticket_Chart } from '../../../utils/ExportColumns';

const columns = [
  {
    title: 'DateTime',
    dataIndex: 'DateTime',
    key: '1',
  },
  {
    title: 'Bid',
    dataIndex: 'Bid',
    key: '2',
  },
  {
    title: 'Ask',
    dataIndex: 'ask',
    key: '3',
  },
  {
    title: 'Last',
    dataIndex: 'Last',
    key: '4',
  },
  {
    title: 'Volumn',
    dataIndex: 'Volumn',
    key: '5',
  },

];
const data = [
  {
    key: '1',
    'DateTime': '2024-03-29 10:00:00',
    'Bid': 100,
    'Ask': 105,
    'Last': 102,
    'Volumn': 1000,
  },
  {
    key: '2',
    'DateTime': '2024-03-29 10:05:00',
    'Bid': 102,
    'Ask': 107,
    'Last': 105,
    'Volumn': 1200,
  },
  // Add more data objects as needed
];


const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, TableHeaderColor } } = theme.useToken();
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };
  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Tickets & Charts</h1>
      </div>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} backendColumns={Ticket_Chart} exportColumns={Export_Ticket_Chart}
      />
      {/* <CustomTable
          direction="/ticket-charts"
          formName = "Tickets & Charts" 
          columns={columns}
          data={allSetting} 
          headerStyle={headerStyle}
          total={totalRecords}
          onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
        /> */}
    </div>
  )
}
export default Index