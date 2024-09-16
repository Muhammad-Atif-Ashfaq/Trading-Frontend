import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginTerminalUser } from '../../../store/terminalSlice';
import CustomNotification from '../../../components/CustomNotification';
import CustomButton from '../../../components/CustomButton';
import CustomTextField from '../../../components/CustomTextField';
import CustomPassowordField from '../../../components/CustomPassowordField';
import { ToastContainer, toast } from 'react-toastify';
import ErrorPage from '../../../components/ErrorPage';
import { TerminalValidationKey } from '../../../utils/_Terminal';

export default function Terminal() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { brand_id } = useParams();

  const local_login_id = localStorage.getItem('login_id');
  const local_password = localStorage.getItem('password');

  const [isLoading, setIsLoading] = React.useState(false);
  const [login_id, setLogin_id] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isValidBrand, setIsValidBrand] = React.useState(null);

  const TerminalLogin_Handler = async (loginData) => {

    setIsLoading(true);
    const res = await dispatch(loginTerminalUser(loginData));
    setIsLoading(false);
    const { payload } = res;

    if (payload[2]) {
      if (login_id && password) {
        localStorage.setItem('login_id', login_id);
        localStorage.setItem('password', password);
      } 

      CustomNotification({
        type: 'success',
        title: 'Login Successfully',
        description: payload[1],
        key: 1,
      });

      

      navigate(`/terminal-market-watch/${brand_id}`);
    } else {
      for (const [key, errors] of Object.entries(payload[0])) {
        errors.forEach((error) => {
          CustomNotification({
            type: 'error',
            title: 'Validation Error',
            description: error,
            key: `${key}-${error}`,
          });
        });
      }


    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      TerminalLogin_Handler({login_id, password,brand_id});
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const validateBrand = async (parentDomain) => {
      const { data: { success } } = await TerminalValidationKey(brand_id, parentDomain);
      setIsValidBrand(success);
      
      if (success && local_login_id && local_password) {
        TerminalLogin_Handler({ login_id: local_login_id, password: local_password,brand_id });
      }
    };
    const referrer = document.referrer;
    if (referrer) {
      const url = new URL(referrer);
      validateBrand(url.hostname);
    }
    
  }, [brand_id]);

  if (isValidBrand === null) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    isValidBrand ? (
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col gap-8 shadow-lg p-8 w-1/3' onKeyPress={handleKeyPress}>
          <h1 className='text-[30px] font-bold text-center'>Terminal Login</h1>
          <CustomTextField
            label={'Login Id'}
            varient={'standard'}
            sx={{ marginTop: '10px' }}
            onChange={(e) => setLogin_id(e.target.value)}
            auto
          />
          <CustomPassowordField
            label={'Password'}
            sx={{ marginTop: '10px' }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomButton
            Text={'Login In'}
            type
            loading={isLoading}
            style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', borderRadius: '6px' }}
            onClickHandler={() => TerminalLogin_Handler({ login_id, password,brand_id })}
          />
          <ToastContainer />
        </div>
      </div>
    ) : (
      <ErrorPage />
    )
  );
}
