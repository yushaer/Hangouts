import {react,useEffect,useState} from 'react';
import {AppBar,Avatar, Button,Menu,MenuItem,IconButton,Box,Tooltip} from '@mui/material/';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import decode from 'jwt-decode';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Socket } from 'socket.io-client';
const NavBar = (props) => {
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
      
        <AppBar  className='navbar'>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             Hangouts
            </Typography>
            {profile ?(
             <Box sx={{ flexGrow: 0 }}>
      
             <Button
        id="basic-button" 
       color="inherit"
       endIcon={<KeyboardArrowDownIcon />}
        
        aria-controls={Boolean(anchorElUser) ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorElUser)? 'true' : undefined}
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
               
                 <MenuItem  onClick={handleCloseUserMenu}>
                   <Typography textAlign="center" >Loggout</Typography>
                 </MenuItem>
              
             </Menu>
           </Box>
            ):(
            <Button color="inherit">Login</Button>
            )}
          </Toolbar>
        </AppBar>
  
    );
    }
    export default NavBar;