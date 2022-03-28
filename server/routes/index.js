import express from 'express';
import userRouter from './users.js';

const rootRouter = express.Router();

rootRouter.get('/',(req,res)=>{
    res.status(200).json({"message":"You have accessed the back-end for hangouts made by Yushae Raza"})
});
rootRouter.use('/user' ,userRouter);
export default rootRouter;
