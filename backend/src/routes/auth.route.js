import { Router } from "express";
import { registerValidate,loginValidate } from "../validate/auth.validate.js";
import { registerController,loginController,LogoutController,getmeController,GoogleController,forgetControlller,verifyController,resetController } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import passport from "passport";
import configure from "../config/config.js";


const authRoute=Router();



authRoute.post("/register",registerValidate,registerController)
authRoute.post("/login",loginValidate,loginController)
authRoute.post("/logout",authMiddleware,LogoutController)
authRoute.get("/getme",authMiddleware,getmeController)
authRoute.post("/forget",forgetControlller)
authRoute.post("/verify",verifyController)
authRoute.post("/reset",resetController)



authRoute.get("/google",passport.authenticate("google",{
    scope:["profile","email"]
}))

authRoute.get("/google/callback",passport.authenticate("google",{session:false
}),GoogleController)

export default authRoute