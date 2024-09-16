import { theme } from 'antd';
import React from 'react'
import SettingsMenu from './SettingsMenu'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import SettingsInfo from './SettingsInfo';
import { useSelector } from 'react-redux';

const Index = () => {

  const { token: { colorBG, TableHeaderColor } } = theme.useToken();
    const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
  const navigate = useNavigate()
  return (
    <div className='p-8 flex flex-col md:gap-8' style={{ backgroundColor: colorBG }}>
    <div className='flex items-center gap-3'>
     <img 
        src={ARROW_BACK_CDN} 
        alt='back icon' 
        className='cursor-pointer'
        onClick={()=> navigate(-1)}
        />
      <h1 className='text-2xl font-semibold'>Settings</h1>

    </div>
    <div className=' flex flex-col md:gap-8 lg:gap-10 '>
        <SettingsMenu />
      {userRole === 'brand' &&  <SettingsInfo/> } 
    </div>
    </div>
  )
}

export default Index