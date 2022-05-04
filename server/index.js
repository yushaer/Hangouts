import  express from "express";
import dotenv  from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import {createServer} from 'http';
import {Server} from 'socket.io'
import rootRouter from './routes/index.js';
import jwt from "jsonwebtoken";
import { ExpressPeerServer } from 'peer';
import { connected } from "process";

if(!process.env.PRODUCTION){
   
    dotenv.config()
}
const CONNECTION_URL = process.env.DB;
const port = process.env.PORT||5000;
const app = express();
const server=createServer(app);
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/'
  });
  app.use('/peerjs', peerServer);
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
const sockets = new Map() 
io.on('connection',(socket)=>{
    sockets.set(socket.id,socket);
    if(!onlineUsers.find(user=>user._id===socket.userId)){
        onlineUsers.push({_id:socket.userId,username:socket.username})
    }
       // onlineUsers.push({id:socket.userId,username:socket.username});
       socket.join(socket.userId) 
       
  
socket.on('join', (data, replyFn) => {
    console.log("you joined")
     socket.broadcast.emit('userJoined', onlineUsers)
    replyFn(onlineUsers);
  });
    
    
   console.log(socket.username+" connected");
  

  
 
 
    socket.on('disconnect',()=>{
        
        onlineUsers=onlineUsers.filter(user=>user._id!==socket.userId);
        console.log(  onlineUsers);
        socket.broadcast.emit('caller-disconnected',onlineUsers);
        
       
       
    });
  
     
    socket.on('callUser',(data)=>{  
        console.log("calling" + data.user + " from " + data.from)
  
        io.to(data.user).emit('callUser',{signal:data.signalData,from:data.from,name:data.name});
    });
    socket.on('sendMessage',(data)=>{  
        
  
        io.to(data.user).emit('recieveMessage',{message:data.message,userId:data.userId,name:data.name});
    });
    socket.on('endcall',(data)=>{
       
        console.log('endcall');
        io.to(data.user).emit('call-ended',{signal:data.signalData});
    });



    socket.on('accept-call',(data)=>{
        console.log("test")
        io.to(data.to).emit('callaccepted',data.signal);
    });
    socket.on('decline-call',(data)=>{
        console.log("test")
        io.to(data.to).emit('call-declined',data.signal);
    });
    socket.on('getusers', (data,replyFn)=>{
        console.log(`${socket.id}: received getrooms event with ${data}`);
        const rooms = Array.from(io.sockets.adapter.rooms).map( (room) => {
            return { name: room[0], members: Array.from(room[1])}
        })
        replyFn(rooms)
    })
});
;
 
 mongoose.connect(CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>server.listen(port,()=>console.log(`Server running on port: ${port}`)))
.catch((error)=>console.log(error.message));
