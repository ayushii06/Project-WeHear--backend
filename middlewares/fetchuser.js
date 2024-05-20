const jwt=require('jsonwebtoken');
const User = require('../models/userModel')
require('dotenv').config();
const asyncHandler = require("express-async-handler");


const fetchuser =asyncHandler(async (req,res,next)=>{
    //Get the user from jwt token and add id to req object

    const token = req.header('auth-token');
    console.log(token)
    if(!token){
        return res.status(401).send({error : "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET);
        console.log(data)
        const user = await User.findById(data?.id);
        req.user=user;
        next();
 
    }catch (error) {
        res.status(401).send({error : "Please authenticate using a valid token"})
        
    }
  
})


module.exports={fetchuser};