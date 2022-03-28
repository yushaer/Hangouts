import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import {useNavigate } from 'react-router-dom';
const SocketContext = createContext();
const ContextProvider = ({ children }) => {
    
 const[socket,setSocket]=useState(null);
  
  const [ stream, setStream ] = useState();
  const [caller,setCaller] = useState({});
  const [loggedIn,setLoggedIn] = useState(false);
  const [profile, setProfile] =useState(JSON.parse(localStorage.getItem('profile')));
  const[receivingCall,setRecievingCall]=useState(false);
  const [userslist , setUserslist] = useState([]);
  const[callEnded,setCallEnded]=useState(false);
 const[isCalling,setIsCalling]=useState(false);
  
  const [ callAccepted, setCallAccepted ] = useState(false)
  const myVideo = useRef();
  const userVideo = useRef();
  
	const connectionRef= useRef();
    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
				 
            setStream(stream)
                   myVideo.current.srcObject = stream
           })
			
        if (JSON.parse(localStorage.getItem('profile'))?.token){
           
        setProfile(JSON.parse(localStorage.getItem('profile')));
        const newSocket = io.connect('http://localhost:5000',{
            query:{
               token:JSON.parse(localStorage.getItem('profile')).token,
               username:JSON.parse(localStorage.getItem('profile')).user.username
            }
          })
         
		 
		   setProfile(JSON.parse(localStorage.getItem('profile')));
	
		   setSocket( newSocket);
           newSocket.emit('join', 'data', (onlineUsers) =>{
				
				for(var i=0;i<onlineUsers.length;i++){
					if(onlineUsers[i].username===JSON.parse(localStorage.getItem('profile')).user.username){
						onlineUsers.splice(i,1);
					}
				}
				setUserslist(onlineUsers);
				console.log(onlineUsers);  

		   })
           newSocket.on('userJoined',(onlineUsers)=>{
			for(var i=0;i<onlineUsers.length;i++){
				if(onlineUsers[i].username===JSON.parse(localStorage.getItem('profile')).user.username){
					onlineUsers.splice(i,1);
				}
			}
			setUserslist(onlineUsers);
			console.log(onlineUsers);  
		})

		 
			  
			  
		
        newSocket.on('caller-disconnected',( onlineUsers)=>{
				for(var i=0;i<onlineUsers.length;i++){
					if(onlineUsers[i].username===JSON.parse(localStorage.getItem('profile')).user.username){
						onlineUsers.splice(i,1);
					}
				}
				console.log(onlineUsers);
				setUserslist(onlineUsers);
			})
		
			newSocket.on("callUser", (data)=> {
				console.log(data);
				setCaller({id:data.from,name:data.name,signal:data.signal});
						   
				   setRecievingCall(true);	
			   
				  })
			  
                  newSocket.on("call-ended", (data) => {
				
					  setRecievingCall(false);
								
					  setCallAccepted(false); 
					  setCallEnded(true);
                      setCaller(null);
					  window.location.reload();
					  
								
		
					   })
					  


		
		
				
					  
						
		
	
                    }
		
		
		 
	  }, []);
      const callUser = (toCall) => {
        if(toCall){
             setIsCalling(true);
          const peer = new Peer({
              initiator: true,
              trickle: false,
              stream: stream
          })
          peer.on("signal", (data) => {
              socket.emit("callUser", {
              user: toCall.id,
                  signalData: data,
                  from: profile.user.id,
                  name: profile.user.username
              })
        peer.on("stream", (stream) => {
              
                  userVideo.current.srcObject = stream
               
          })
          socket.on("callaccepted", (signal) => {
            setIsCalling( false);
              setCallAccepted(true)
              peer.signal(signal)
          })
  
          connectionRef.current = peer
          })
  
      }
      
      }
    const answerCall =(audio) =>  {
        audio.pause();
          setCallAccepted(true)
          const peer = new Peer({
              initiator: false,
              trickle: false,
              stream: stream
          })
          peer.on("signal", (data) => {
              socket.emit("accept-call", { signal: data, to: caller.id })
          })
          peer.on("stream", (streams) => {
              userVideo.current.srcObject = streams
          })
  
          peer.signal(caller.signal)
          connectionRef.current = peer
      }
    
  
      const leaveCall =	async () => {
          const peer = new Peer({
              initiator: true,
              trickle: false
           
          })
          setCallEnded(true);
      ;
  
          await socket.emit("endcall", {
               user: caller.id,
                  socketData:"sd",
                  from: profile.user.id,
                  name: profile.user.username
  
              }, () => {
                  console.log("call ended");
                  setCallAccepted(false);
                  setRecievingCall(false);
                  setCaller(null);
               
                  connectionRef.current.destroy();
                
               
              })
              window.location.reload();
              
              
               
              
          
          
          
          
          
           
              
  
  
      
          
          
      }
  
 
    return (
      <SocketContext.Provider value={{
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
      }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  
  export { ContextProvider, SocketContext };