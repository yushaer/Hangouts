import react, { useContext,useState ,useRef} from 'react';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import {
  Paper,
  Grid,
  Divider,
  Typography,

  TextField,
  Box,
  Fab,

} from "@mui/material";

import SendIcon from '@mui/icons-material/Send';
import { SocketContext } from '../../Context';
import Message from './Message';


const Chat=(props)=>{
  const[message,setMessage]=useState("");
const inpRef=useRef();

  const { messages , sendMessage} = useContext(SocketContext);
  const handleChange=(e)=>{
    
   setMessage(e.target.value);
  
  }
  const handleSend=()=>{
    sendMessage(message)
  
    inpRef.current.value="";
    setMessage("");
  
    
  
  }
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      handleSend();
    }
  }
  return (
    <Paper className="chat" elevation={6}>
      <Typography variant="h2" align="center">
        Chat
      </Typography>
      <Divider />
<br></br>
      <Box className='messageArea'>
        {messages.map((message, idx) => (
          <react.Fragment key={idx}><Message key={idx} isSender={props.profile.user.id == message.userId}
            name={message.name} message={message.message} /><br  ></br></react.Fragment>
            ))}
      


        </Box>
        <Divider/>
        <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11} lg={11}>
                        <TextField  variant="standard" inputRef={inpRef}   label="Type Something" onKeyPress={handleKeyPress} onChange={handleChange } fullWidth />
                    </Grid>
                    <Grid item xs={1} lg={1} align="right">
                        <Fab color="primary" aria-label="add"  onClick={handleSend}><SendIcon /></Fab>
                    </Grid>
                </Grid>
    </Paper>
  );
}
export default Chat;