import react from 'react';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { Container,Paper,Typography,Grid,Box,IconButton,Stack} from '@mui/material';
import NavBar from '../NavBar';
import { SocketContext } from '../../Context';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useState, useEffect ,useRef,useContext} from 'react';
import CallEndIcon from '@mui/icons-material/CallEnd';
const UserVideo = (props) => {
const { audioMuted,shareScreen,toggleMuteAudio,leaveCall} = useContext(SocketContext);


    return (

        <Box style={props.style}><Paper 
        elevation={8}
        className="video-player"
      
        >
        
      
        <Typography variant="h5" >
            {props.name}
        </Typography>
            <video  className="video" playsInline muted={props.ismuted} ref={props.video} autoPlay  controls />
            {props.children}
            <div className="video-controls">
            {props.ismuted?(
            <Stack direction="row" spacing={1}>
         <IconButton color="primary" className="icon-btn" onClick={ shareScreen}><ScreenShareIcon fontSize="large"  /></IconButton>
         
         <IconButton color={!audioMuted?"primary":"error"} className="icon-btn" onClick={ toggleMuteAudio}>{!audioMuted?(<VolumeMuteIcon fontSize="large"  />):(<VolumeOffIcon fontSize="large"  />  )}</IconButton>
         <IconButton color="error" className="icon-btn" onClick={ leaveCall}><CallEndIcon fontSize="large"  /> </IconButton>
         </Stack>
         )
         
         :null}
           
            </div>
        </Paper>
            </Box>
    )

}
export default UserVideo;
