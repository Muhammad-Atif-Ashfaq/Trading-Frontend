import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import {Stack} from '@mui/material'
import BycryptoLogo from '../../../assets/images/Bycrypto-Logo.svg'
import CustomNotification from '../../../components/CustomNotification';
import { logoutTerminalUser, setOrderRefresh, setTerminalUserAccount } from '../../../store/terminalSlice';
import CustomButton from '../../../components/CustomButton';
import Swal from 'sweetalert2';
import { checkNaN } from '../../../utils/helpers';
import usePusher from '../../../pusher/usePusher';
import { setSingleActiveAccount,setActiveFlag } from '../../../store/activeAccountSlice';


function NewAppBar() {
    
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
    const user = useSelector(({ terminal }) => terminal?.user?.trading_account)
    const active_margin = useSelector(({terminal})=>terminal?.active_margin)
    const active_free_margin = useSelector(({terminal})=>terminal?.active_free_margin)
    const equity_g = useSelector(({terminal})=>terminal?.active_equity)
    const active_margin_level = useSelector(({terminal})=>terminal?.active_margin_level)
    const active_profit =  useSelector(({terminal})=>terminal?.active_profit);
    const token = useSelector(({ terminal }) => terminal?.user?.token)
    const activeAccounts = useSelector(({activeAccount})=> activeAccount?.activeAccountData)

    const dispatch = useDispatch()

    const trading_pusher_data= usePusher('trading_accounts','update')
            
    const pages = [
        {title:"Balance",value:checkNaN(user?.balance)},
        {title:"Credit",value:checkNaN(user?.credit)},
        {title:"Equity",value:checkNaN(equity_g)},
        {title:"Margin",value:checkNaN(active_margin)},
        {title:"Free Margin",value: checkNaN(active_free_margin)},
        {title:"Margin Level",value:checkNaN(active_margin_level) + '%' },
        {title:"Login ID",value:user?.login_id},
        {title:"Name",value:user?.name},
        
    ]; 



  const Logout_Handler = async () => {
   
    Swal.fire({
      title: "Are you sure?",
      text: "You are logout from terminal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!"
    }).then(async (result) => {
      if (result.isConfirmed) {
      try {
      localStorage.removeItem("login_id")
      localStorage.removeItem("password")
      const responseMessage = await dispatch(logoutTerminalUser(token));
          if (responseMessage) {
            
            dispatch(setActiveFlag(false))
            dispatch(setSingleActiveAccount(null))

            CustomNotification({
              type: "success",
              title: "Logout",
              description: "Logout successfully",
              key: 1,
            });
          }
          else {
            CustomNotification({
              type: "error",
              title: "Invalid",
              description: res.message,
              key: 2,
            });
          }
    } catch (error) {
      CustomNotification({
        type: "error",
        title: "Invalid",
        description: error.message,
        key: 2,
      });
    }
      }
    })


  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(()=>{
      
    if(trading_pusher_data  && trading_pusher_data?.id === user?.id &&  Object.keys(trading_pusher_data).length > 0){
      const updatedUser = {...user,...trading_pusher_data}
      dispatch(setTerminalUserAccount(updatedUser))

    }
  },[trading_pusher_data])




  return (
    <AppBar position="static" sx={{backgroundColor:"transparent",color:"#000",boxShadow:'none',borderBottom:"2px solid #ECEFF9"}}>
      <Container maxWidth="screen">
        <Toolbar disableGutters sx={{p:0}}>
    
          

            {/* mobile size screen Logo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.title}</Typography>
                  <Typography textAlign="center">{page.value}</Typography>

                </MenuItem>
              ))}
            </Menu>
          </Box>

             {/* mobile size screen text */}
           <img src={BycryptoLogo} alt='icon' className="block md:hidden"/>
  

          <Stack direction="row" sx={{ flexGrow: 1,justifyContent:"between",m:0,p:0 }}>
            
            <Box  sx={{ display: 'flex' ,flex:1,alignItems:"center"}}>
              
             {/* <img src={BycryptoLogo} alt='icon' className="hidden md:block" /> */}
            </Box>
           
            <Box sx={{ display: 'flex' ,flex:2,justifyContent:"space-between",alignItems:"center"}}>
            {pages.slice(0,6).map((page) => (
              
             <div key={page.title} className="flex flex-col items-start justify-center  my-3 gap-2">
              <Typography
                key={page}
                onClick={handleCloseNavMenu}
                sx={{  display: 'block',fontSize:"13px",color:"#D52B1E",fontWeight:600 }}
              >
                {page.title}
              </Typography>
              <Typography
                key={page}
                onClick={handleCloseNavMenu}
                sx={{  display: 'block',fontSize:"13px",color:"#1CAC70",fontWeight:600 }}
              >
                {page.value}
              </Typography>
              </div> 
            ))}
            </Box>
            
             <Box sx={{ display: 'flex' ,flex:1,justifyContent:"center",alignItems:"center",gap:3}}>

             <span className='flex items-center font-bold text-[#D52B1E] text-[13px] gap-1'>
              <span
                    className="span font-bold text-[#1CAC70] text-[13px]"
              >
                 P/L : {" "}
              </span>{`${user?.currency} ${active_profit}`}
                </span>
          
            {pages.slice(6).map((page) => (
              <div key={page.title} className="flex items-start justify-start my-3">
               
                <Typography
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{color:"#1CAC70",fontSize:"13px",fontWeight:600, display: 'block' }}
                >
                  { page.value}
                </Typography>
              </div>
            ))}

              <Box sx={{ display:"flex",flexGrow: 0,alignItems:"center" }}>
                  
                  <CustomButton
                    Text={'Logout'}
                    style={{ padding: '18px', display: "flex", flexDirection: "column", borderRadius: '3px', backgroundColor: "#B22E0C", color: "#fff", border: "none" }}
                    onClickHandler={Logout_Handler}
                />
                </Box>


            </Box>
            
         
          </Stack>

       
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NewAppBar;
