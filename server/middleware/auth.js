import jwt from "jsonwebtoken";

import config from "../config.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
 

    let decodedData;

    if (token) {      
      decodedData = jwt.verify(token,config.token_secret);

      req.userId = decodedData?.id;
      req.username=decodedData?.username;
 
    

    } 
    next();
  } catch (error) {
   // console.log(error);
    res.status(401).json({message:"Invalid-Token"});
  }
};

export default auth;