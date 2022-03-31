import {react,useEffect,useState} from 'react';
import PropTypes from "prop-types";
import {AppBar,Avatar, Button,Menu,MenuItem,IconButton,Box,Tooltip} from '@mui/material/';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import PhoneIcon from "@mui/icons-material/Phone";
 
import decode from 'jwt-decode';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Socket } from 'socket.io-client';

import { useContext } from 'react';
import { SocketContext } from '../Context';

const NavBar = (props) => {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
const{callUser,  userslist,}=useContext(SocketContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
     
      
      <Toolbar />
      <Typography variant="h4" >Online Users</Typography>
      <Divider />
      <List>
        {userslist.map((user,index)=>{
          return(
            <ListItem className='drawer-item' key={index} >
              <ListItemIcon>
                <Avatar>{user.username[0]}</Avatar>
              </ListItemIcon>
               <ListItemText primary={user.username} />
               <IconButton color="primary" aria-label="call" className="icon-btn" onClick={()=>props.callUser({id:user._id,username:user.username})}>
                <PhoneIcon fontSize="large" />
            </IconButton>
            </ListItem>
            
          )
        })}
        
      </List>
      <Divider />
   
    </div>
  );
  const container = window !== undefined ? () => window().document.body : undefined;

  const location = useLocation();
  const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);
     
    const [profile, setProfile] =useState(JSON.parse(localStorage.getItem('profile')));
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };

  
  
    const handleCloseUserMenu = () => {
      logout();
      setAnchorElUser(null);
    };
    const logout=()=>{
      localStorage.clear();
   
      setProfile(null);
   
      navigate('/login');
      window.location.reload();
    }
    useEffect(() => {
   
      const token = profile?.token;
  
      if (token) {
        const decodedToken = decode(token);
  
        if (decodedToken.exp * 1000 < new Date().getTime()) logout();
      }
      else{
        navigate('/login');
      }
  
      setProfile(JSON.parse(localStorage.getItem('profile')));
    }, [location]);
  
    return (
      
        <>  <Box sx={{ display: "flex" }}>
        <CssBaseline /><AppBar 
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${props.drawerWidth}px)` },
            ml: { sm: `${props.drawerWidth}px` }
          }}
        
        className='navbar'>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hangouts
          </Typography>
          {profile ? (
            <Box sx={{ flexGrow: 0 }}>

              <Button
                id="basic-button"
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}

                aria-controls={Boolean(anchorElUser) ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElUser) ? 'true' : undefined}
                onClick={handleOpenUserMenu}
              >
                {profile.user.username}
              </Button>

              <Menu
                sx={{ mt: '45px' }}
                id="user-menu"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    width: '200px',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 30,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >

                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Loggout</Typography>
                </MenuItem>

              </Menu>
            </Box>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar></Box><Box
        component="nav"
        sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            PaperProps={{className:'nav-drawer'}}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: props.drawerWidth
              }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
    className='navbar'
    
            PaperProps={{className:'nav-drawer'}}
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                
                boxSizing: "border-box",
                width: props.drawerWidth
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box></>
  
    );
    }
    NavBar.propTypes = {
      /**
       * Injected by the documentation to work in an iframe.
       * You won't need it on your project.
       */
      window: PropTypes.func
    };
    export default NavBar;