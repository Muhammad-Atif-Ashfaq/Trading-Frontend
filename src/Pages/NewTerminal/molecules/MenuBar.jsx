import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import WatchMarket from '../../../assets/images/WatchMarket.svg';
import ActiveWatchMarket from '../../../assets/images/ActiveWatchMarket.svg';
import MarketNews from '../../../assets/images/MarketNews.svg';
import ActiveMarketNews from '../../../assets/images/ActiveMarketNews.svg'
import EconomicCalender from '../../../assets/images/EconomicCalender.svg';
import ActiveEconomicCalender from '../../../assets/images/ActiveEconomicCalender.svg'
import Indicator from '../../../assets/images/indicator.svg'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomNotification from '../../../components/CustomNotification';
import { useDispatch,useSelector } from 'react-redux';
import { logoutTerminalUser } from '../../../store/terminalSlice';




function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const navigate =  useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const  params_brand_id  =  useParams()?.brand_id
  const  params_domain  =  useParams()?.domain



  const Logout_Handler = async () => {
    try {
      localStorage.removeItem("login_id")
      localStorage.removeItem("password")
      const res = await dispatch(logoutTerminalUser());
      if (res.payload) {
        CustomNotification({
          type: "success",
          title: "Logout",
          description: res.payload,
          key: 1,
        });
    

        
      } else {
        CustomNotification({
          type: "error",
          title: "Invalid",
          description: 'Terminal Logout Failed Successfully.',
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
  };




  const handleListItemClick = (index,path) => {
    if(path === `/terminal/${params_domain}/${params_brand_id}`){
      Logout_Handler()
    } 
    setSelectedIndex(index);
    navigate(path)
};


  const terminalArrays = [{title:'Market Watch',path:`/terminal-market-watch/${params_domain}/${params_brand_id}`,image:WatchMarket,activeImage:ActiveWatchMarket},{title:'Economic Calender',path:`/terminal-economic-calender/${params_domain}/${params_brand_id}`,image:EconomicCalender,activeImage:ActiveEconomicCalender},{title:'Market News',path:`/terminal-market-news/${params_domain}/${params_brand_id}`,image:MarketNews,activeImage:ActiveMarketNews},{title:'Logout',path:`/terminal/${params_domain}/${params_brand_id}`,image:WatchMarket,activeImage:ActiveWatchMarket}]

  React.useEffect(()=>{
   
     switch(location?.pathname){
          case `/terminal-market-watch/${params_domain}/${params_brand_id}`:
            setSelectedIndex(0);
            break;
          case `/terminal-economic-calender/${params_domain}/${params_brand_id}` :
             setSelectedIndex(1);
            break;
          case `/terminal-market-news/${params_domain}/${params_brand_id}`: 
            setSelectedIndex(2)
            break;
        }
  },[])


  const drawer = (
    <Box sx={{ width:"100%", backgroundColor:"#fff",borderRight:"2px solid #ECEFF9" }}>
     
    <Typography sx={{p:3,color:"#90B78F"}}>Menu</Typography>
      <List >
      {terminalArrays.map((terminal, index) => (
          <ListItem key={terminal.title} disablePadding>
            <ListItemButton 
                 selected={selectedIndex === index}
                 onClick={() => handleListItemClick(index,terminal.path)}
                sx={{  backgroundColor: selectedIndex === index ? '#9FA8C7' : 'transparent', pr:0 }}>
              <ListItemIcon>
               
                <img src={selectedIndex === index ? terminal.activeImage :terminal.image } alt="Image" />
             
              </ListItemIcon>
              <ListItemText  primary={ 
                <Typography variant="body2" fontFamily={'Roboto'} fontSize="15px" color={'#9FA8C7'}>
                  {terminal.title}
                </Typography>
                } />

                {selectedIndex === index &&  <img src={Indicator} alt="indicator" />}
            </ListItemButton>

          
          </ListItem>
        ))}

        

      </List>
      
    </Box>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      
      
    
       
          {drawer}
        
      </Box>
      
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
