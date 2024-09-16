import { Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import FeedCard from './FeedCard';
import { GetDataFeeds } from '../../../utils/_DataFeedAPI';
import { useSelector } from 'react-redux';
import { PlusCircleOutlined } from '@ant-design/icons';
import { AddnewSettingsStyle } from '../../Brand/style';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/CustomButton';

const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const [DataFeedList, setDataFeedList] = useState([])
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const res = await GetDataFeeds(token)
      const { data: { payload, message, success } } = res
      setIsLoading(false)
      if (success) {
        setDataFeedList(payload.data)
      }
    } catch (err) {
      alert(err.message)
    }
    if (parseInt(id) !== 0) {
      fetchUpdatedData(DataFeedList, payload.data)
    }
  }
  const fetchUpdatedData = async (DataFeedList, feedlist) => {
    if (id !== 0) {
      setIsLoading(true)
      const res = await SelectSymbolSettingsWRTID(id, token)
      const { data: { message, payload, success } } = res
      setIsLoading(false)
      if (success) {
        (payload.name)

        setCommission(payload.commission);
      }

    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex justify-between mb-3'>
          <h1 className='text-2xl font-semibold'>Data Feed</h1>
          <CustomButton
            Text='Add New Data Feed'
            style={AddnewSettingsStyle}
            icon={<PlusCircleOutlined />}
            onClickHandler={() => navigate('/data-feed/0')}
          />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
          {DataFeedList.map(val => <FeedCard id={val.id} feedName={val.name} feedServer={val.feed_server} enabled={val.enabled} fetchData={fetchData} />)}
          
       
        </div>
      </div>
    </Spin>
  )
}

export default Index