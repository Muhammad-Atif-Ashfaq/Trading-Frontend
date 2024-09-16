import React from 'react'
import { theme } from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';

import CustomButton from '../../components/CustomButton';

const Index = () => {
  const { token: { colorBG, sidebarColor, colorPrimary  } } = theme.useToken();
  
  const Controls = [
   {
    id:1, component: 'CustomButton',
    Text:'Live Order History', 
    style:{borderRadius: '8px', padding: '20px', color: colorPrimary},
    backgroundColor: sidebarColor,
    borderColor: colorPrimary
  }, 
  {
    id:2,
    Text:'Create New Order' ,
    style:{borderRadius: '8px', padding: '20px'}
  }
  ]
  return (
    <div className='p-8' style={{backgroundColor: colorBG}}>
    <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
      <h1 className='text-2xl font-semibold'>Single Trading Account</h1>
     <div className='flex flex-wrap items-center gap-4'>
      {
        Controls.map(val=>  <CustomButton
          Text={val.Text} 
          style={val.style}
          icon={<PlusCircleOutlined />}
          backgroundColor={val.backgroundColor}
          borderColor={val.borderColor}
          />)
      }
   
     </div>
    </div>
  </div>
  )
}

export default Index