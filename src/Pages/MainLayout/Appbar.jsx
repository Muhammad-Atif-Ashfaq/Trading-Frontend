import React from 'react'
import { Layout, Button, theme, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MoonFilled
} from '@ant-design/icons';

import PROFILE_CDN from '../../assets/images/profile.png'
import DOWNARR_CDN from '../../assets/images/down-arrow.svg'
import { colaspedBtnStyle, headerStyle } from './style';


const { Header } = Layout;
const Appbar = ({collapsed, setCollapsed}) => {
  const {token: { colorPrimary, colorTransparentPrimary, colorBgContainer}} = theme.useToken();
  return (
    <Header
    style={{ background: colorBgContainer, ...headerStyle}}
    className="sticky top-0 flex items-center justify-between"
  >
     <div>
        <Button
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{  color: colorPrimary,...colaspedBtnStyle}}
        />
      </div>
      <div className='flex gap-4 px-6'>
      <div className="flex items-center justify-center h-[34px] w-[34px] rounded-full cursor-pointer" style={{ backgroundColor: colorTransparentPrimary }}>
        <MoonFilled style={{ color: colorPrimary, fontSize: '24px' }} />
      </div>
         <Avatar src={PROFILE_CDN} />
         <img src={DOWNARR_CDN} alt='icon' className='cursor-pointer' />
      </div>
  </Header>
  )
}

export default Appbar