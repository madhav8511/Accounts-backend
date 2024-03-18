const jwt = require("jsonwebtoken");
require('dotenv').config()

const fetchUser = (req,res,next)=>{
    //Get user from jwt token and add id to request...
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send("Please authenticate using a valid token-1");
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send("Please authenticate using a valid token-2");
    }
    
}

exports.fetchUser = fetchUser;