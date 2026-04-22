import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import errorHandler from "./middleware/error.middleware.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import configure from "./config/config.js";

const app=express();


app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID:configure.google_client_id,
    clientSecret:configure.google_client_secret,
    callbackURL:"/api/auth/google/callback",
    proxy:true
}, async (_accessToken, _refreshToken, profile, done) => {
    return done(null, profile);
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());




app.use("/api/auth",authRoute);

app.use(errorHandler);
export default app;