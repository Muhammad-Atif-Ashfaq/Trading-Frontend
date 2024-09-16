import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

const CustomAvatar = () => {
  return (
    <Avatar size={120} icon={<UserOutlined />} />
  )
}

export default CustomAvatar