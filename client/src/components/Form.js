import {react,useEffect,useState} from 'react';
import { useNavigate,Link  } from 'react-router-dom';
import * as api from '../api';
import { Grid,Typography,Container,Paper, Button } from '@mui/material';
import FormInput from './FormInput';
const initialState = { username: '', email: '', password: '', password2: '' };
const Form=(props)=>{
  const [error,setError]=useState(null);
  const [success,setSuccess]=useState(null);
  const navigate = useNavigate();
  const [formData,setFormData]=useState(initialState);
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget;
    
      if(props.type==="register"){
        try {
          const{data} = await api.register(formData);
          setError(null);
          setSuccess(data.message);
          //console.log(data);
        } catch (error) {
          setError(error.response.data.message);
          console.log(error.response.data);
        }
      }
      else{
        try{
          const{data}= await api.login(formData)
          setError(null);
          setSuccess(data.message);
      
          localStorage.setItem('profile',JSON.stringify({user:data.User,token:data.token}));
        
        //  await dispatch(setUser());
        navigate("/");
          //history("/")
          //console.log(data);
        }
        catch (error) {
          setError(error.response.data.message);
          console.log(error.response.data);
        }
        
      }


   
   
    

    // Do some checks
   

  
  }

return (
  <Container component="main" maxWidth="xs"> <Paper elevation={8}  className="auth-form-paper" mt={7} justify="center" >
      <div className='form-header'>
        <Typography variant="h3" component="h1" align ='center'>{props.title}</Typography>
        </div>
        { error ?(<Typography variant="h5" component="h2" align ='center' color="error">{error}</Typography>):
        (<Typography variant="h5" component="h2" align ='center' color="green">{success}</Typography>)}
 
     
      <form className='auth-form' onSubmit={handleSubmit}>
      <Grid container spacing={2}>
      {props.type=="register" ?(
        <FormInput name="username" label="username" type="text" handleChange={handleChange} autoFocus={true}/>
      ) : null}
      <FormInput name="email" label="Email" type="email" handleChange={handleChange} autoFocus={false}/>
      <FormInput name="password" label="Password" type="password" handleChange={handleChange} autoFocus={false}/>
      {props.type=="register" ?(
        <FormInput name="password2" label="Confirm Password" type="password" handleChange={handleChange} autoFocus={false}/>  ) : null}

        </Grid>
        <br></br>
        <Button type="submit" fullWidth variant="contained"   className='submit-button' >
            {props.type}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
            {props.type=="register" ? (<p>Already have a <Link to="/login" >account?</Link></p>)
            :
            <p>
              Not a member? <Link to="/register" >Register</Link>
            </p>
            }
            </Grid>
          </Grid>
        </form>

      
      </Paper>
      
      
      </Container>
)
}
export default Form;
