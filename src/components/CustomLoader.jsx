import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const CustomLoader = ({ color, fontSize = '20px', justifyContent }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '75vh',
      position: 'absolute',
      left: '55%',
    }}
  >
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: fontSize,
            color: color || 'rgba(255, 255, 255, 0.5)',
            justifyContent,
          }}
          spin
        />
      }
    />
  </div>
);
export default CustomLoader;
