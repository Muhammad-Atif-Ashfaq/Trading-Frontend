import React from 'react';
import { Divider, List  } from 'antd';
import {RightOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SettingsMenu = () => {

    const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);

  const data = [
    {id:1, title:'FireWall (IP Restriction)', path:'/firewall/active-ip-list',  display: userRole === 'admin' ? 'show' : 'hide'},
    // { id:2, title:'Margin Call Levels', path:'/margin-levels',  display: userRole === 'admin' ? 'show' : 'hide'},
    {id:3, title:'Change Password', path:'/change-password',  display: 'show'},
    {id:4, title:'Login Activity', path:'/login-activity',  display: 'show'},
  ];
 return (
  <>
    <List
      bordered
      dataSource={data}
      renderItem={(item) => (
        item.display === 'show' ?(
        <List.Item className='text-xl font-semibold cursor-pointer'> 
          <Link to={item.path}> <span className='hover:text-green-600'>{item.title} </span></Link> 
          <Link to={item.path}>  <RightOutlined /> </Link>
        </List.Item>
        ) :''
      )}
    />
  </>
  )
};
export default SettingsMenu;