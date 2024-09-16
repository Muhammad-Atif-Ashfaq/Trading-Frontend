import { theme } from 'antd';
import React, { useState } from 'react';

import FEED_CDN from '../../../assets/images/feed.svg';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DeleteSymbolData } from '../../../utils/_DataFeedAPI';
import { useSelector } from 'react-redux';
import { CustomDeleteDeleteHandler } from '../../../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';

const FeedCard = ({ feedName, feedServer, id, fetchData, enabled }) => {
  const token = useSelector(({ user }) => user?.user?.token)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState()
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  return (
    <div className='bg-white border rounded-lg p-4' onClick={()=>navigate(`/data-feed/${id}`)}>
      <div className='flex justify-between'>
        <div className='w-[30px] h-[30px] rounded-full relative' style={{ backgroundColor: parseInt(enabled) ? colorTransparentPrimary: "#fecaca" }}>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full' style={{ backgroundColor:parseInt(enabled) ? colorPrimary :"red" }}></div>

        </div>
         {/* <div>
          <Link to={`/data-feed/${id}`}><EditOutlined style={{ fontSize: "24px", color: colorPrimary, cursor: 'pointer' }} /></Link>
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(id, token, DeleteSymbolData, setIsLoading, fetchData)} />
        </div> */}
      </div>


      <div className='flex flex-col gap-3 items-center justify-center'>
        <div>
          <img src={FEED_CDN} alt='icon' />
        </div>
        <div>
          <h1 className='text-xl font-bold text-center'>{feedName}</h1>
        </div>
        <div className='text-lg font-semibold text-gray-400' style={{ wordWrap: 'anywhere' }}  >
          {feedServer}
        </div>

      </div>
    </div>
  );
};

export default FeedCard;
