
import './style.scss';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import VideoChat from './components/VideoChat';
import Form from './components/Form';
import { StyledEngineProvider } from '@mui/material/styles';
import { ContextProvider } from './Context';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
  
      
      {/* <Route path="/popular" element={<MovieList name="Popular" type="popular" />} />
     
      <Route path="/discover" element={<MovieList name="Discover" type="featured" />} />
      <Route path="/recommended" element={<MovieList type="recomended" name="Recommended Movies"  />} /> */}
      <Route path="/" element={  <StyledEngineProvider injectFirst> <ContextProvider><VideoChat /></ContextProvider></StyledEngineProvider>} />
      <Route path="/login" element={<Form title="Login" type="login" />} />
      <Route path="/register" element={<Form title="Register" type="register" />} />
      {/* 
      <Route path="/register" element={ <AuthForm title="Register" type="register" />} /> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
