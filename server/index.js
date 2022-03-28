import  express from "express";
import dotenv  from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import {createServer} from 'http';
import {Server} from 'socket.io'
import rootRouter from './routes/index.js';
import jwt from "jsonwebtoken";
import { connected } from "process";

if(!process.env.PRODUCTION){
   
    dotenv.config()
}

const app = express();
const server=createServer(app);
const io = new Server(server,{  
    cors: {
        origin: '*',
        methods: ['GET,POST'],
    }


});
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

app.use('/',rootRouter);
const CONNECTION_URL = process.env.DB;
const port = process.env.PORT||5000;
io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.TOKENSECRET);
      socket.userId = payload.id;
        socket.username = payload.username;
      
      
      next();
    } catch (err) {}
  });
let onlineUsers =[] ;
io.on('connection',(socket)=>{
    if(!onlineUsers.find(user=>user.id===socket.userId)){
        onlineUsers.push({id:socket.userId,username:socket.username})
    }
       // onlineUsers.push({id:socket.userId,username:socket.username});
    
  
    
    socket.join(socket.userId)  
   console.log(socket.username+" connected");
  socket.broadcast.emit('getonlineUsers',onlineUsers);
  
 
    socket.on('getonlineUsers',(onlineUsers)=>{
        console.log("SAd")
        socket.broadcast.emit('getonlineUsers',onlineUsers);
    }
        )
    socket.on('disconnect',()=>{
        
        onlineUsers=onlineUsers.filter(user=>user.id!==socket.userId);
  
        socket.broadcast.emit('caller-disconnected');
       
    });
  
     
    socket.on('callUser',(data)=>{  
        console.log("Test")
  
        io.to(data.user).emit('callUser',{signal:data.signalData,from:data.from,name:data.name});
    });
    socket.on('endcall',(data)=>{
       
        console.log('endcall');
        io.to(data.user).emit('call-ended',{signal:data.signalData});
    });



    socket.on('accept-call',(data)=>{
        console.log("test")
        io.to(data.to).emit('callaccepted',data.signal);
    });
});
server.listen(port,()=>console.log(`Server running on port: ${port}`));
 
 mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
// .then(()=>app.listen(port,()=>console.log(`Server running on port: ${port}`)))
// .catch((error)=>console.log(error.message));
