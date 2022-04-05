import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import {useNavigate } from 'react-router-dom';
import  ringtone from './components/discord_ringtone.mp3';
const SocketContext = createContext();
const ContextProvider = ({ children }) => {
  
 const[socket,setSocket]=useState(null);
  
 const audioRef = useRef(new Audio(ringtone))
  const [ stream, setStream ] = useState();
  const [caller,setCaller] = useState({});
  const [loggedIn,setLoggedIn] = useState(false);
  const [profile, setProfile] =useState(JSON.parse(localStorage.getItem('profile')));
  const[receivingCall,setRecievingCall]=useState(false);
  const [userslist , setUserslist] = useState([]);
  const[callEnded,setCallEnded]=useState(false);
  const[calledUser,setCalledUser]=useState(null);
 const[isCalling,setIsCalling]=useState(false);
 const[messages,setMessages]=useState([]);
 
  const[audioMuted,setAudioMuted]=useState(false);
  const [ callAccepted, setCallAccepted ] = useState(false);
  const [callcontrols,setCallcontrols]=useState( {
    audioMuted:false,
    videoMuted:false,
    screenshare:false
  });

  const myVideo = useRef();
 
const toCall=useState(null);
  const userVideo = useRef();
  
	const connectionRef= useRef();
    useEffect(() => {
        
      
			
        if (JSON.parse(localStorage.getItem('profile'))?.token){
        //  console.log(messages )
           
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
				//console.log(onlineUsers);  

		   })
           newSocket.on('userJoined',(onlineUsers)=>{
			for(var i=0;i<onlineUsers.length;i++){
				if(onlineUsers[i].username===JSON.parse(localStorage.getItem('profile')).user.username){
					onlineUsers.splice(i,1);
				}
			}
			setUserslist(onlineUsers);
		//	console.log(onlineUsers);  
		})


		 
			  
			  
		
        newSocket.on('caller-disconnected',( onlineUsers)=>{
				for(var i=0;i<onlineUsers.length;i++){
					if(onlineUsers[i].username===JSON.parse(localStorage.getItem('profile')).user.username){
						onlineUsers.splice(i,1);
					}
				}
     
    
            userVideo?.current?.srcObject.getTracks().forEach(track => track.stop());
       
          setCallAccepted(false);
          
          setRecievingCall(false);
               
          setIsCalling(false);
          
       
                

        
        setUserslist(onlineUsers);
				//console.log(onlineUsers);
				
			})
		
			newSocket.on("callUser", (data)=> {
				//console.log(data);
				setCaller({id:data.from,name:data.name,signal:data.signal});
						   
				   setRecievingCall(true);	
           audioRef.current.play();
			   
				  })
          const addMessage = (msg) => setMessages(prevMessages => [...prevMessages, msg]);
          newSocket.on('recieveMessage', addMessage,()=>{
            newSocket.off('recieveMessage', addMessage)
          })
        
			  
              newSocket.on("call-ended", (data) => {
				
                setCallAccepted(false);
				 
                setRecievingCall(false);
                     
					  userVideo?.current?.srcObject.getTracks().forEach(track => track.stop());
                
             
                      setCalledUser(null)
                      setIsCalling(false);
                      setCalledUser(null);
                      setCaller(null);
                      setIsCalling(false);
                      setRecievingCall(false);
           
                
								
		
					   })
					  


		
		
				
					  
						
		
	
                    }
		
                    
		 
	  }, []);


    const sendMessage=(message)=>{

 
      socket.emit('sendMessage',{
        user:calledUser.id,
        message:message,
        userId:profile.user.id,
        name:profile.user.username


      });
      setMessages([...messages,{message,userId:profile.user.id,name:profile.user.username}]);
 
//console.log(messages)


    }
    const getUserDevices = (callback) => {
        navigator.mediaDevices.enumerateDevices().then(function(devices) {
          const hasCam = devices.some(function(d) { return d.kind == "videoinput"; });
          const hasMic = devices.some(function(d) { return d.kind == "audioinput"; });
          const constraints = { video: hasCam, audio: hasMic };
          navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
          
            callback(stream);
          }).catch((error)=>{
                
            console.log(error)
             alert("Please allow access to your camera and mic")
        })
          
        })
      }
        
    

  

      
      const callUser = (toCall) => {
        if(toCall){
            //console.log("test")
            getUserDevices(function(stream){
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
                setCalledUser({id:toCall.id,username:toCall.username});
                setIsCalling( false);
                  setCallAccepted(true)
                  peer.signal(signal)
                  connectionRef.current = peer
               
              })
         
              socket.on("call-declined", (signal) => {
                setCalledUser(null);
                setIsCalling( false);
                  setCallAccepted(false)

                
              })
      
              
              })
            })
            
          
         }
      
      }
    const answerCall =() =>  {
      audioRef.current.pause();
        setCalledUser({id:caller.id,username:caller.name});
     
        getUserDevices(function(stream){
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
      const declineCall =() =>  {
        audioRef.current.pause();
       
        socket.emit("decline-call", { signal: "", to: caller.id });
       setCalledUser(null);
       setCaller(null);	
        setIsCalling(false);
        setRecievingCall(false);	

       
          
      }
     const disconectCall = () => {
      setCallAccepted(false);
      userVideo?.current?.srcObject.getTracks().forEach(track => track.stop());
   userVideo.current.srcObject=null
   
       socket.emit("endcall", {
             user:  calledUser.id,
                socketData:"sd",
                from: profile.user.id,
                name: profile.user.username

            })
     
            setCalledUser(null);
            setCaller(null);
            setIsCalling(false);
            setRecievingCall(false);
          }

  
      const leaveCall =	() => {
 // console.log(connectionRef.current.userId);
          
     disconectCall();
              
              
               
              
          
          
          
          
          
           
              
  
  
      
          
          
      }
      function toggleMuteAudio(){
        if(stream){
          setAudioMuted(!audioMuted)
          stream.getAudioTracks()[0].enabled = audioMuted
        }
      }
      function shareScreen(){
        console.log(messages)
        navigator.mediaDevices.getDisplayMedia({ video:{ width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }}, audio: true })
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
            socket,
            messages,
            sendMessage,
        callUser,
        leaveCall,
        answerCall, 
        shareScreen,
        toggleMuteAudio,
        declineCall,

      }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  
  export { ContextProvider, SocketContext };