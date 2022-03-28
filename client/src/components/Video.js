import react from 'react';
import { Container,Paper,Typography,Grid,Box} from '@mui/material';
import NavBar from './NavBar';

import { useState, useEffect ,useRef} from 'react';

const UserVideo = (props) => {


    return (

        <Box><Paper 
        elevation={8}
        className="video-player"
      
        >
        
      
        <Typography variant="h5" >
            {props.name}
        </Typography>
            <video  className="video" playsInline muted={props.ismuted} ref={props.video} autoPlay  />
            {props.children}
       
        </Paper>
            </Box>
    )

}
export default UserVideo;
