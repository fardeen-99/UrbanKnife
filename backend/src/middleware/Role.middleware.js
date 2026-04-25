import configure from "../config/config.js";
import jwt from "jsonwebtoken";
import usermodel from "../models/auth.model.js";
import HandleError from "../utils/error.js";


async function RoleMiddleware(req,res,next){
    try {
        const token=req.cookies.token;
        if(!token){
            return next(new HandleError(401,"User not logged in"));
        }
        const decodedToken=jwt.verify(token,configure.jwt_secret);
        const user=await usermodel.findById(decodedToken.id);
        if(!user){
            return next(new HandleError(404,"User not found"));
        }
        if(user.role !== "seller" ){
            return next(new HandleError(403,"User is not authorized to create product"));
        }
        req.role=user.role;
        req.user=user._id;
        next();
    }
    catch(error){
        next(error);
    }
}

export default RoleMiddleware