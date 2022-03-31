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
  const[calledUser,setCalledUser]=useState(null);
 const[isCalling,setIsCalling]=useState(false);
  const[audioMuted,setAudioMuted]=useState(false);
  const [ callAccepted, setCallAccepted ] = useState(false)
  const myVideo = useRef();
 
const toCall=useState(null);
  const userVideo = useRef();
  
	const connectionRef= useRef();
    useEffect(() => {
        
      
			
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
				
                setCallAccepted(false);
				 
                setRecievingCall(false);
                     
					  userVideo?.current?.srcObject.getTracks().forEach(track => track.stop());
                
             
                      setCalledUser(null)
                      setIsCalling(false);
                 
           
                
								
		
					   })
					  


		
		
				
					  
						
		
	
                    }
		
                    
		 
	  }, []);
      
      const callUser = (toCall) => {
        if(toCall){
            
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
				 
                setStream(stream)
                if(myVideo.current){
                    myVideo.current.srcObject = stream
               
               
                }
                
                setIsCalling(true);
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream,
                    userId:toCall.id
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
                  setCalledUser(toCall.id);
                  setIsCalling( false);
                    setCallAccepted(true)
                    peer.signal(signal)
                })
        
                connectionRef.current = peer
                })
        
               }).catch(()=>{
                     alert("Please allow access to your camera and mic")
                })
          
         }
      
      }
    const answerCall =(audio) =>  {
        audio.pause();
        setCalledUser(caller.id);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
				 
            setStream(stream)
            if(myVideo.current){
                myVideo.current.srcObject = stream
           
           
            }
            setCallAccepted(true)
          const peer = new Peer({
              initiator: false,
              trickle: false,
              userId:caller.id,
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
        })
          
      }
    
  
      const leaveCall =	() => {
  console.log(connectionRef.current.userId);
          
     setCallAccepted(false);
        userVideo?.current?.srcObject.getTracks().forEach(track => track.stop());
     userVideo.current.srcObject=null
     
         socket.emit("endcall", {
               user:  calledUser,
                  socketData:"sd",
                  from: profile.user.id,
                  name: profile.user.username
  
              })
       
              setCalledUser(null);
              setCaller(null);
              setIsCalling(false);
              setRecievingCall(false);
  
              
              
               
              
          
          
          
          
          
           
              
  
  
      
          
          
      }
      function toggleMuteAudio(){
        if(stream){
          setAudioMuted(!audioMuted)
          stream.getAudioTracks()[0].enabled = audioMuted
        }
      }
      function shareScreen(){
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(screenStream=>{
            navigator.mediaDevices.getUserMedia({ audio: {'echoCancellation': true}, video: false }).then(VOICE_STREAM=>{

            
                const AUDIO_CONTEXT = new AudioContext();
            const AUDIO_MERGER = AUDIO_CONTEXT.createMediaStreamDestination(); // audio merger

       
            const MEDIA_AUDIO = AUDIO_CONTEXT.createMediaStreamSource(screenStream); // passing source of on-screen audio
                        
            const MIC_AUDIO = AUDIO_CONTEXT.createMediaStreamSource(VOICE_STREAM);

            MEDIA_AUDIO.connect(AUDIO_MERGER); // passing media-audio to merger
            MIC_AUDIO.connect(AUDIO_MERGER); // passing  microphone-audio to merger
            const TRACKS = [...screenStream.getVideoTracks(), ...AUDIO_MERGER.stream.getTracks()]
            const newStream= new MediaStream(TRACKS); 
            connectionRef.current.replaceTrack(stream.getVideoTracks()[0],newStream.getVideoTracks()[0],stream)
            connectionRef.current.replaceTrack(stream.getAudioTracks()[0],newStream.getAudioTracks()[0],stream)
           myVideo.current.srcObject= newStream;
           newStream.getTracks()[0].onended = () =>{
                connectionRef.current.replaceTrack(newStream.getVideoTracks()[0],stream.getVideoTracks()[0],stream)
                      myVideo.current.srcObject=stream
             } // retrieving microphone-media
            
          
        })
      })
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
            audioMuted,
        callUser,
        leaveCall,
        answerCall, 
        shareScreen,
        toggleMuteAudio

      }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  
  export { ContextProvider, SocketContext };