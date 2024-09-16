
import 'antd/dist/reset.css';
import { notification } from 'antd';

const CustomNotification = ({ type, title, description, key }) => {
  notification[type]({
    message: title,
    description: <div dangerouslySetInnerHTML={{ __html: description }} />,
    top: 65,
    key
    
  });
};

export default CustomNotification;