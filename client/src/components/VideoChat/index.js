import react, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import {Toolbar, Container,Grid,Paper,Button,Dialog,DialogTitle,Box, DialogContent} from '@mui/material';
import NavBar from '../NavBar';
import UserVideo from './Video';
import * as api from '../../api';
import  ringtone from '../discord_ringtone.mp3';
import {useNavigate } from 'react-router-dom';
 
import { CircularProgress } from '@mui/material';
import { useState, useEffect ,useRef} from 'react';
import Chat from '../Chat';
import Peer from "simple-peer"
import io from "socket.io-client"

import { SocketContext } from '../../Context';

const VideoChat = () => {
	const drawerWidth = 240;
	const [socket,setSocket] = useState(null);
	const navigate = useNavigate();
 
	const {
		myVideo,
        caller,
        userVideo,
        callAccepted,
        callEnded,
        receivingCall,
        userslist,
		isCalling,
        callUser,
        leaveCall,
        answerCall,
		declineCall



	  }=useContext(SocketContext);
	  //console.log( callAccepted)

  const[toCall,setToCall]=useState(null);
 const [loggedIn,setLoggedIn] = useState(false);
  

  const [profile, setProfile] =useState(JSON.parse(localStorage.getItem('profile')));

const handleCall=(user)=>{
	setToCall(user);
	callUser(user);
}
	const handleChange=(e,child)=>{
		//console.log(child.props.children);
		setToCall({id:e.target.value,username:child.props.children});
	}
	useEffect(() => {
	
		if (!JSON.parse(localStorage.getItem('profile'))?.token){
			navigate('/login');
		}
		
	setProfile(JSON.parse(localStorage.getItem('profile')));

		setLoggedIn(true)
		
		
		 
	  }, [navigate]);
	//   useEffect(()=>{
	// 	(receivingCall && !callAccepted)  ?audio.play() : audio.pause();
	//   },[receivingCall,callAccepted])




				

 
	if(loggedIn){
		//console.log(userslist)
	 
		return (

			<><NavBar drawerWidth ={drawerWidth}   socket={socket} callUser={handleCall}/>
			<Box component="main" sx={{
			  flexGrow: 1,
			  p: 3,
			  width: { sm: `calc(100% - ${drawerWidth}px)` },
			  ml: { sm: `${drawerWidth}px` }
			}}>
				    <Toolbar />
				{isCalling ? (
				<Dialog  
				BackdropProps={{ style: { backgroundColor: "transparent" } }}
				open={isCalling } className="dialog"  
  				PaperProps={{
    			style: {
					 
					backgroundColor: 'rgba(255, 255, 255,0.8)',
				
					},
 				 }}>
					
					<DialogContent className='calling-dialog'> 
					<DialogTitle>Calling {toCall.username}</DialogTitle>
						<CircularProgress color="success" /></DialogContent>
				
					</Dialog>):null}
				{receivingCall && !callAccepted  ?(	 
					<Dialog  open={receivingCall && !callAccepted}>
					<DialogTitle>{caller.name} is calling</DialogTitle>
					<Button onClick={()=>answerCall()}  >Accept</Button>
					<Button onClick={()=>declineCall()}>Decline</Button>
					</Dialog>
				
					)  :null }
			<br></br><Typography variant="h1" align='center'>Video Chat</Typography>
			
			<Grid container spacing={2} className="gridContainer">
			<Grid item xs={12} md={6}>
			<UserVideo video={myVideo} style={(callAccepted && !callEnded)?{display:'block'}:{display:'none'}} ismuted={true} name={profile.user.username}/>
			
			

			
			
			</Grid>
			{callAccepted && !callEnded ? (<Grid item xs={12} md={6}>
			<UserVideo video={userVideo}  ismuted={false} name={receivingCall?caller.name:toCall.username}/>
			</Grid>) : null}
			
			</Grid>
			<br></br>
			{(callAccepted && !callEnded)?<Chat  profile={profile} />:null}
		 
			 
			 
		</Box> </>
		);
			}
			else{
				return null;
			}
    }
    export default VideoChat; 