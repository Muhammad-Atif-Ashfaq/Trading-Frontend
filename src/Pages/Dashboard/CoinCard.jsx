import React from 'react';
import { theme } from 'antd';

const CoinCard = ({ title, subtitle, value, subvalue, img_url, graph_url, subvalue_color }) => {
  const { token: {  Gray2, colorTransparentPrimary } } = theme.useToken();
  
  return (
    <div className='w-full p-4 flex-grow bg-white flex flex-col sm:flex-row items-center justify-between rounded-2xl border'>
      <div className='flex gap-4'>
        <div className="flex items-center justify-center rounded-lg cursor-pointer p-4" style={{ backgroundColor: colorTransparentPrimary }}>
          <div className="flex-shrink-0"> <img src={img_url} alt='icon' className='object-cover h-8 w-8 rounded-full' /></div>
         
        </div>
        <div className='flex flex-col'>
          <span className='text-lg font-medium'>{title}</span>
          <span className='text-sm font-medium' style={{ color: Gray2 }}>{subtitle}</span>
        </div>
      </div>
      <div className='flex gap-4 mt-4 sm:mt-0'>
        <div className='flex flex-col'>
          <span className='text-sm font-medium' style={{ color: Gray2 }}>{value}</span>
          <span className='text-sm font-medium' style={{ color: subvalue_color }}>{subvalue}</span>
        </div>
        <img src={graph_url} alt='icon' className='h-auto w-16 md:w-auto' />
      </div>
    </div>
  );
};

export default CoinCard;
