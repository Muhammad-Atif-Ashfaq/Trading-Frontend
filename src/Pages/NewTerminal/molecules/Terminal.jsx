import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { loginTerminalUser } from '../../../store/terminalSlice';
import CustomNotification from '../../../components/CustomNotification';
import CustomButton from '../../../components/CustomButton';
import CustomTextField from '../../../components/CustomTextField';
import CustomPassowordField from '../../../components/CustomPassowordField';
import { ToastContainer, toast } from 'react-toastify';
import ErrorPage from '../../../components/ErrorPage';
import { TerminalValidationKey } from '../../../utils/_Terminal';
import usePusher from '../../../pusher/usePusher';
import { setActiveFlag,setSingleActiveAccount } from '../../../store/activeAccountSlice';



export default function Terminal() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { domain,brand_id } = useParams();

  const local_login_id = localStorage.getItem('login_id');
  const local_password = localStorage.getItem('password');

  const [isLoading, setIsLoading] = React.useState(false);
  const [login_id, setLogin_id] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isValidBrand, setIsValidBrand] = React.useState(null);
  
  
  const trading_account= usePusher('trading_accounts','update')


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


  
  // for local
  React.useEffect(() => {
    const validateBrand = async () => {
      const response = await TerminalValidationKey(brand_id,domain);
      

      const { data: { success } } = await TerminalValidationKey(brand_id,domain);
      setIsValidBrand(success);
      
      if (success && local_login_id && local_password) {
        TerminalLogin_Handler({ login_id: local_login_id, password: local_password,brand_id });
      }
    };

    validateBrand();
  }, [domain,brand_id]);

//  for live
 
//   React.useEffect(() => {
//     const validateBrand = async (parentDomain) => {
//       const { data: { success } } = await TerminalValidationKey(brand_id, parentDomain);
//       setIsValidBrand(success);
      
//       if (success && local_login_id && local_password) {
//         TerminalLogin_Handler({ login_id: local_login_id, password: local_password,brand_id });
//       }
//     };
    
//     const referrer = document.referrer;
//     if (referrer) {
//       const url = new URL(referrer);
//       validateBrand(url.hostname);
//     }
    
//   }, [domain,brand_id]);


  React.useEffect(()=>{
      

    if(trading_account &&  Object.keys(trading_account).length > 0){
    

      dispatch(setActiveFlag(true))
     
      dispatch(setSingleActiveAccount(trading_account))

    }

  },[trading_account])


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
