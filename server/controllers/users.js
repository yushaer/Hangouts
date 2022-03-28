import Jwt  from "jsonwebtoken";
import Bcrypt from 'bcrypt';
import Users from '../models/users.js';
import jwt from 'jsonwebtoken';
import config from "../config.js";
export const login=async(req,res)=>{
    let{email,password}=req.body;
    try{
        const User = await Users.findOne({email});
        if(!User){//ds
            return res.status(404).json({ message: "User Not Found" });

        }
        const isCorrect= await Bcrypt.compare(password, User.password);
        if(!isCorrect){
            return res.status(400).json({ message: "Wrong Password" });
        }
        console.log("uid" +User._id)
        const token =jwt.sign({ username: User.username,id:User._id }, config.token_secret, { expiresIn: "1h" });
    
        res.status(200).json({User:{username: User.username,id:User._id},token,message:"login successful" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Unable to Sign in" });
      }

}
export const getUsersList=async(req,res)=>{
    try{
        const users=await Users.find({'_id': {$ne:req.userId}},'_id username');
       // console.log(users);
        res.status(200).json(users);
    }catch(error){
        console.log(error.message)
        res.status(404).json({message:error.message});
    }
}
export const get_user= async(req,res)=>{
    try{
        const user= req.body;
        console.log(user)
        res.status(200).json({username:req.username,userId:req.userId})
    }
    catch(error){
        res.status(401).json({message:error.message});
    }
}
export const register= async(req,res)=>{
    try{
        console.log(req.body)
        const user = req.body;
        const usernameExists= await Users.findOne({username:user.username});
        const emailExists= await Users.findOne({email:user.email});
        
        if(usernameExists||emailExists){
            if(usernameExists){
                return res.status(400).json({"message":"Username is in use"});
            }
            if(emailExists){
                return res.status(400).json({"message":"Email is in use"});
            }
           

        }
        else if ( user.password!=user.password2){
            return res.status(400).json({"message":"passwords dont match"});
        }
         
        
            user.password=await Bcrypt.hash(req.body.password,10);
            const User=await new Users({
                username:user.username,
                email:user.email,
                password:user.password

            });
         
            try{
                await User.save();
                res.status(200).json({message:"Account Successfully Created"})
            }
         
            catch(error){
                res.status(500).json({message:error.message});
            }
            
      

    }
     catch(error){
        res.status(500).json({error:error.message});
    }
  
}