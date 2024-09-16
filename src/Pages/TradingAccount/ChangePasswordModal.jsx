import React, {  useState } from 'react';
import * as Yup from 'yup';
import CustomPassowordField from '../../components/CustomPassowordField';
import { Typography ,Stack} from '@mui/material';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import CustomNotification from '../../components/CustomNotification';
import { Spin } from 'antd';


  
const ChangePasswordModal = ({ setIsModalOpen,password,setPassword   }) => {
 

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({}); 
 const [isLoading,setIsLoading] = useState(false)




const validationSchema = Yup.object().shape({
 
  newPassword: Yup.string()
    .required('New password is required')
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different from the old password'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword'), null], 'New passwords and confirm password must match')
    .notOneOf([Yup.ref('oldPassword')], 'Confirm password must be different from the old password'),
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
     
    }
  };
  const clearFields = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  
  const handleChangePassword = async () => {
   
    try{
      if(password === oldPassword){
      await validationSchema.validate({
        newPassword,
        confirmPassword,
      }, { abortEarly: false });

      setErrors({});
      setIsLoading(false)
      setIsModalOpen(false)
      setPassword(confirmPassword)
      clearFields()  

      }
      
      else{
        setErrors({...errors, oldPassword:"Incorrect old password, Please enter correct old password "})
      }
     
  
    
  } catch(error){
     const validationErrors = {};
    error.inner.forEach((err) => {
      validationErrors[err.path] = err.message;
    });
    setErrors(validationErrors);
    setIsLoading(false)
      
  }
  
  };



  return (
      <Spin spinning={isLoading} size="large">
        <div className='flex flex-col gap-6'>

              <Typography sx={{fontSize:"24px",fontWeight:600}}>Change Password</Typography>

              <Stack>
              <CustomPassowordField
                  name="old_password"
                  label="Old Password"
                  variant="standard"
                  value={oldPassword}
                  onChange={e => handleInputChange('oldPassword', e.target.value)}
              />
              {errors.oldPassword && <span style={{ color: 'red' }}>{errors.oldPassword}</span>}
              </Stack>

              <Stack>
              <CustomPassowordField
                  name="newPassword"
                  label="New Password"
                  variant="standard"
                  value={newPassword}
                  onChange={e => handleInputChange('newPassword', e.target.value)}
              />
              {errors.newPassword && <span style={{ color: 'red' }}>{errors.newPassword}</span>}
              </Stack>

            <Stack>
              <CustomPassowordField
                  name="confirmPassword"
                  label="Confirm Password"
                  variant="standard"
                  value={confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
              />
              {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
              </Stack>

              <div style={footerStyle}>
                <CustomButton
                  Text={'Ok'}
                  style={submitStyle}
                  onClickHandler={handleChangePassword}
                />
                
              </div>

        </div>
      </Spin>
  );
};

export default ChangePasswordModal;
