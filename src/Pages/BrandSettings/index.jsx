import React, { useState } from 'react'
import { theme } from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';

import CustomButton from '../../components/CustomButton'
import CustomTable from '../../components/CustomTable';
import CustomModal from '../../components/CustomModal';
import BrandSettingsModal from './BrandSettingsModal';
import { AddNewStyle, footerStyle, footerSubmit } from './style';

const columns = [
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];
const Index = () => {
  const {token: { colorBG, TableHeaderColor  }} = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black', 
  };

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
        <h1 className='text-2xl font-semibold'>Brand Settings</h1>
        <div>
          <CustomButton
            Text='Add New Brand'
            style={AddNewStyle}
            icon={<PlusCircleOutlined />}
            onClickHandler={showModal}
          />
        </div>
      </div>
      <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
      <CustomModal 
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel} 
        title={''}
        width={800}
        footer={[
          <div style={footerStyle}>
            <CustomButton
              Text={'Submit'}
              onClickHandler={handleOk}
              style={footerSubmit}
            />
          </div>
        ]}
       >
          <BrandSettingsModal />
       </CustomModal>
    </div>
  )
}

export default Index