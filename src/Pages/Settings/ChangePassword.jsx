import { theme } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import CustomButton from '../../components/CustomButton';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useSelector } from 'react-redux';
import { ChangingPassword } from '../../utils/_SettingAPI';
import CustomPassowordField from '../../components/CustomPassowordField';
import CustomNotification from '../../components/CustomNotification';

const ChangePassword = () => {
  const token = useSelector(({ user }) => user?.user?.token);
  const originalPassword = useSelector(({ user }) => user?.user?.user?.original_password);
  const user_id = useSelector(({user})=>user?.user?.user?.id)

  const { token: { colorBG } } = theme.useToken();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);


  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const clearFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate({
        oldPassword,
        newPassword,
        confirmPassword,
      }, { abortEarly: false });

      setIsLoading(true);

      if (oldPassword !== originalPassword) {
        setErrors(prevErrors => ({ ...prevErrors, oldPassword: 'Old password is incorrect' }));
        setIsLoading(false);
        return;
      }

      setErrors({});

      const passwordData = {
        new_password: newPassword,
        user_id
      };

      const res = await ChangingPassword(passwordData, token);
      const { data: { message, success } } = res;

      setIsLoading(false);

      if (success) {
        CustomNotification({
          type: 'success',
          title: 'Password Changed Successfully',
          description: message,
          key: 1
        });
        navigate('/settings')
      } else {
        CustomNotification({
          type: 'error',
          title: 'Password Changed Failed',
          description: message,
          key: 2
        });
      }

    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      setIsLoading(false);
    }
  };


  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src={ARROW_BACK_CDN}
            alt='back icon'
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
          <h1 className='text-2xl font-bold'>Change Password</h1>
        </div>
      </div>
      <div className='border mt-6 rounded-lg p-8 flex flex-col gap-6'>

        <CustomPassowordField
          label={'Old Password'}
          value={oldPassword}
          onChange={(e) => handleInputChange('oldPassword', e.target.value)}
          // error={errors.oldPassword}
          name={"oldPassword"}
        />
        {errors.oldPassword && <span style={{ color: 'red' }}>{errors.oldPassword}</span>}



        <CustomPassowordField
          label={'New Password'}
          value={newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          error={errors.newPassword}
          name={"newPassword"}
        />
        {errors.newPassword && <span style={{ color: 'red' }}>{errors.newPassword}</span>}



        <CustomPassowordField
          label={'Confirm Password'}
          value={confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          name={"confirmPassword"}
        />
        {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}


        <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
          <CustomButton
            Text='Cancel'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
              backgroundColor: '#c5c5c5',
              borderColor: '#c5c5c5',
              color: '#fff'
            }}
            onClickHandler={() => navigate(-1)}
          />
          <CustomButton
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
            onClickHandler={handleSubmit}
            loading={isLoading}
          />
        </div>
      </div>

    </div>
  );
}

export default ChangePassword;
