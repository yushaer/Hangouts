 
 import dotenv  from "dotenv";
 if(!process.env.PRODUCTION){
   
  dotenv.config()
}
 const config={token_secret:process.env.TOKENSECRET}
 export default config;