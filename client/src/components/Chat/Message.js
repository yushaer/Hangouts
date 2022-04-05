import React from "react";
import {Avatar,Stack,Box,Typography} from "@mui/material";
 
const Message=(props)=>{   

    if(props.isSender){
        return (
            <Stack direction="row"  className="message-container" justifyContent="start">
             <div>
             <Avatar alt={props.name}>{props.name[0]}</Avatar>
             <Typography variant="label" align="center">{props.name}</Typography>
               </div> 
           
            <div className="message message-left">
              <Typography variant="p">{props.message}</Typography>
            </div>       
            </Stack>
        )
    }
    return(
        <Stack direction="row" justifyContent="end">

        <div className="message message-right">
          <Typography variant="p">{props.message}</Typography>
          </div>  <div style={{marginRight:"1rem"}}>
             <Avatar alt={props.name}>{props.name[0]}</Avatar>
             <Typography variant="label">{props.name}</Typography>
               </div> 
        </Stack>
    )
}
export default Message;
