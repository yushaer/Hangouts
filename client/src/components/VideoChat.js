import react, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import { Container,Grid,Paper,Button,Dialog,DialogTitle, DialogContent} from '@mui/material';
import NavBar from './NavBar';
import UserVideo from './Video';
import * as api from '../api';
import  ringtone from './discord_ringtone.mp3';
import {useNavigate } from 'react-router-dom';
import Controls from './Controls';
import { CircularProgress } from '@mui/material';
import { useState, useEffect ,useRef} from 'react';
import Peer from "simple-peer"
import io from "socket.io-client"

import { SocketContext } from '../Context';
const VideoChat = () => {

	const [socket,setSocket] = useState(null);
	const navigate = useNavigate();
	const audio = new Audio(ringtone);
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
        answerCall


	  }=useContext(SocketContext);
	  console.log( callAccepted)
//   const myVideo = useRef();
//   const [ stream, setStream ] = useState();
//   const [caller,setCaller] = useState({});
  const[toCall,setToCall]=useState(null);
 const [loggedIn,setLoggedIn] = useState(false);
  
//   const[receivingCall,setRecievingCall]=useState(false);
//   const[callEnded,setCallEnded]=useState(false);
//   const [ callAccepted, setCallAccepted ] = useState(false)
//  const [userslist , setUserslist] = useState([]);
  const [profile, setProfile] =useState(JSON.parse(localStorage.getItem('profile')));
//   const userVideo = useRef();
// 	const connectionRef= useRef();
	const handleChange=(e,child)=>{
		console.log(child.props.children);
		setToCall({id:e.target.value,username:child.props.children});
	}
	useEffect(() => {
	
		if (!JSON.parse(localStorage.getItem('profile'))?.token){
			navigate('/login');
		}
		

		setLoggedIn(true)
		
		
		 
	  }, [navigate]);
	  useEffect(()=>{
		(receivingCall && !callAccepted)  ?audio.play() : audio.pause();
	  },[receivingCall,callAccepted])




				
//   const callUser = () => {
// 	  if(toCall){
// 		const peer = new Peer({
// 			initiator: true,
// 			trickle: false,
// 			stream: stream
// 		})
// 		peer.on("signal", (data) => {
// 			socket.emit("callUser", {
// 			user: toCall.id,
// 				signalData: data,
// 				from: profile.user.id,
// 				name: profile.user.username
// 			})
//       peer.on("stream", (stream) => {
			
// 				userVideo.current.srcObject = stream
			 
// 		})
// 		socket.on("callaccepted", (signal) => {
// 			setCallAccepted(true)
// 			peer.signal(signal)
// 		})

// 		connectionRef.current = peer
// 		})

// 	}
	
// 	}
//   const answerCall =() =>  {
// 		setCallAccepted(true)
// 		const peer = new Peer({
// 			initiator: false,
// 			trickle: false,
// 			stream: stream
// 		})
// 		peer.on("signal", (data) => {
// 			socket.emit("accept-call", { signal: data, to: caller.id })
// 		})
// 		peer.on("stream", (streams) => {
// 			userVideo.current.srcObject = streams
// 		})

// 		peer.signal(caller.signal)
// 		connectionRef.current = peer
// 	}
  

// 	const leaveCall =	async () => {
// 		const peer = new Peer({
// 			initiator: true,
// 			trickle: false
		 
// 		})
// 		setCallEnded(true);
// 		setCallAccepted(false);
// 		setRecievingCall(false);

// 		await socket.emit("endcall", {
// 		 	user: caller.id,
// 				socketData:"sd",
// 				from: profile.user.id,
// 				name: profile.user.username

// 			}, () => {
// 				console.log("call ended");
				
			 
// 				connectionRef.current.destroy();
			 
// 			})
// 			window.location.reload();
			
			
			 
			
		
		
		
		
		
		 
			


	
		
		
// 	}
 
	if(loggedIn){
		//console.log(userslist)
	 
		return (

			<><NavBar socket={socket} /><br></br><br></br><Container>
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
					<Button onClick={()=>answerCall(audio)}  >Accept</Button>
					</Dialog>
				
					)  :null }
			<br></br><Typography variant="h1" align='center'>Video Chat</Typography>
			
			<Grid container spacing={2} className="gridContainer">
			<Grid item xs={12} md={6}>
			<UserVideo video={myVideo} ismuted={true} name={profile.user.username}>
		
			</UserVideo>

			
			
			</Grid>
			{callAccepted && !callEnded ? (<Grid item xs={12} md={6}>
			<UserVideo video={userVideo}  ismuted={false} name={receivingCall?caller.name:toCall.username}/>
			</Grid>) : null}
			
			</Grid>
			<br></br>
			<br></br>
			<br></br>
			<Controls callAccepted={callAccepted} callEnded={callEnded} callUser={()=>callUser(toCall)} userslist={userslist} endCall={leaveCall}  handleSelection={handleChange}  />
		</Container> </>
		);
			}
			else{
				return null;
			}
    }
    export default VideoChat; 