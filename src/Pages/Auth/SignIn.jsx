import React, { useState } from 'react';
import { message } from 'antd';
import CustomTextField from '../../components/CustomTextField';
import CustomPassowordField from '../../components/CustomPassowordField';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../utils/_APICalls';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/UserSlice';
import CustomNotification from '../../components/CustomNotification';

const SignIn = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const SignIn_Handler = async () => {
    const loginData = { email: Email, password: Password };
    setIsLoading(true);
    const res = await dispatch(loginUser(loginData));
    setIsLoading(false);
    const { payload } = res;
    if (payload[2]) {
      CustomNotification({
        type: 'success',
        title: 'Login Successfully',
        description: payload[1],
        key: 1
      });
      navigate('/dashboard');
    } else {
      CustomNotification({
        type: 'error',
        title: 'Invalid',
        description: payload[1],
        key: 2
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      SignIn_Handler();
    }
  };

  return (
    <div className='flex flex-col gap-4 p-8' onKeyPress={handleKeyPress}>
      <h1 className='text-[30px] font-bold text-center'>Sign In</h1>
      <CustomTextField
        label={'Email / Username'}
        varient={'standard'}
        sx={{ width: '360px', marginTop: '10px' }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CustomPassowordField
        label={'Password'}
        sx={{ marginTop: '10px' }}
        onChange={(e) => setPassword(e.target.value)}

      />
      <span className='text-right text-sm font-semibold cursor-pointer'>Forget Password</span>
      <CustomButton
        Text={'Sign In'}
        type
        loading={isLoading}
        style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', borderRadius: '6px' }}
        onClickHandler={SignIn_Handler}
      />
      <span className='text-center text-sm'>Don't have an account?
        <strong className='cursor-pointer'>Sign up</strong>
      </span>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
