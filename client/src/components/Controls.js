import { Box,Container,Grid,Paper,Button,IconButton, Typography} from '@mui/material';
import UsersSelection from './UsersSelection';
import { useState, useEffect } from 'react';
import PhoneIcon from "@mui/icons-material/Phone"

const Controls=(props)=>{
return (

    <Paper elevation={8} align-items="center" className="controls"  >
    
        {props.callAccepted && !props.callEnded?(<Button color="primary" aria-label="call" onClick={props.endCall}>End Call</Button>):
        ( <><UsersSelection users={props.userslist}  handleChange={props.handleSelection}  /><IconButton color="primary" aria-label="call" onClick={props.callUser}>
                <PhoneIcon fontSize="large" />
            </IconButton></>)
    
    
    }
			
			
            
    </Paper>
    
)
}
export default Controls;