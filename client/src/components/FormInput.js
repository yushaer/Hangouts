import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@mui/material';
const FormInput =(props)=>{
    return (
        <Grid item xs={12} >
    <TextField
      name={props.name}
      onChange={props.handleChange}
      variant="standard" 
      required
      fullWidth
      label={props.label}
      autoFocus={props.autoFocus}
      type={props.type}
      
    />
  </Grid>
    )
}
export default FormInput;