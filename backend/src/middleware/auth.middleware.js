import jwt from "jsonwebtoken";
import configure from "../config/config.js";
import HandleError from "../utils/error.js";
import redis from "../config/Cache.js";

const authMiddleware=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            next(new HandleError(401,"Unauthorized"));
        }

        const isTokenBlacklisted=await redis.get(token);
        if(isTokenBlacklisted){
            next(new HandleError(401,"Unauthorized"));
        }
        let decodedToken
        try{
            decodedToken=jwt.verify(token,configure.jwt_secret);
            req.user=decodedToken;
            next()
        }
        catch(error){
            next(new HandleError(401,"Unauthorized"));
        }
    }
    catch(error){
        next(error);
    }
}

export default authMiddleware