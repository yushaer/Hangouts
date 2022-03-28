import react from 'react';
import { Select,Typography,InputLabel,MenuItem,FormControl } from '@mui/material';
const UsersSelection = (props) => {
    return (
        <>
         <Typography variant="label" component="h3">Select User</Typography>
            <FormControl sx={{ m: 1, minWidth: 220 }}>
                <InputLabel id="user-select-label">Users</InputLabel>
                <Select
                    labelId="user-select-label"
                    id="user-select"
                    defaultValue=""
                     
                    onChange={props.handleChange}
                >   
                    {props.users.map((user,index)=>{
                        return <MenuItem key={index} value={user.id} name={user.username} >{user.username}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </>
    )
}
export default UsersSelection;