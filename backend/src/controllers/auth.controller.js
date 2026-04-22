import usermodel from "../models/auth.model.js";
import HandleError from "../utils/error.js";
import configure from "../config/config.js";
import redis from "../config/Cache.js";
import { sendmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";


const generateToken=async(user,res)=>{

const token=jwt.sign({id:user._id},configure.jwt_secret,{expiresIn:"2d"});

res.cookie("token",token,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    // maxAge:2*24*60*60*1000
})

res.status(201).json({
    success:true,
    message:"User registered successfully",
    user:{
        _id:user._id,
        username:user.username,
        email:user.email,
        contact:user.contact,
        role:user.role
    }
    
})

}

export const registerController=async(req,res,next)=>{
    try {
const {username,email,password,contact,isSeller}=req.body;
console.log(username,email,password,contact,isSeller);
const isUserAlreadyExist=await usermodel.findOne({
    $or:[
        {username},
        {email},
        // {contact}
    ]
})

if(isUserAlreadyExist){
    return next(new HandleError(400,"User already exists"));
}

const user=await usermodel.create({
    username,
    email,
    password,
    contact,
    role:isSeller ? "seller" : "buyer"
})

await generateToken(user,res);

    }
catch(error){
next(error);
}
}

export const loginController=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        const user=await usermodel.findOne({email});
        if(!user){
            return next(new HandleError(404,"User not found"));
        }
        const isPasswordValid=await user.comparePassword(password);
        if(!isPasswordValid){
            return next(new HandleError(401,"Invalid password"));
        }
        await generateToken(user,res);
    }
    catch(error){
        next(error);
    }
}

export const LogoutController=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return next(new HandleError(401,"User not logged in"));
        }
        await redis.set(token,Date.now().toString(),"EX",60*60*24);
        res.clearCookie("token");

        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    }
    catch(error){
        next(error);
    }
}

export const getmeController=async(req,res,next)=>{
    try {
        const user=await usermodel.findById(req.user.id);
        if(!user){
            return next(new HandleError(404,"User not found"));
        }
        res.status(200).json({
            success:true,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                contact:user.contact,
                role:user.role
            }
        })
    }
    catch(error){
        next(error);
    }
}


export const GoogleController=async(req,res,next)=>{
    try {
      console.log(req.user);
       const {emails,displayName,photos,id}=req.user;
const email=emails[0].value;
const profile=photos[0].value;

        let user=await usermodel.findOne({email});
        if(!user){
            user=await usermodel.create({
                username:displayName,
                email:email,
                googleId:id
            })
        }
       const token=jwt.sign({id:user._id},configure.jwt_secret,{expiresIn:"2d"});

       res.cookie("token",token)

      //  res.status(201).json({
      //      success:true,
      //      message:"User  successfully",
      //      user:{
      //          _id:user._id,
      //          username:user.username,
      //          email:user.email,
      //          role:user.role,
      //          photo:profile
      //      }
           
      //  })
           res.redirect("http://localhost:5173/");


           
    }
    catch(error){
        next(error);
    }
}

export const forgetControlller=async(req,res,next)=>{
    try {
        const {email}=req.body;
        const user=await usermodel.findOne({email});
        if(!user){
            next(new HandleError(404,"User not found"));
        }
        const otp=Math.floor(100000+Math.random()*900000);
        await redis.set(`otp:${email}`,otp.toString(),"EX",60*60*24);
        await sendmail({
            to:email,
            subject:"OTP for password reset",
            html:`
           <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>UrbanKnife — OTP Verification</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:    #0d0d0d;
      --paper:  #f5f2ed;
      --bone:   #e8e3da;
      --warm:   #c9b99a;
      --rust:   #b84a2e;
      --rust2:  #d45a38;
      --muted:  #7a7268;
      --line:   #d6d0c6;
    }

    body {
      background: #1a1714;
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 48px 16px;
    }

    .shell {
      max-width: 560px;
      margin: 0 auto;
    }

    /* ── top bar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
      padding: 0 2px;
    }
    .brand {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 0.12em;
      color: var(--paper);
    }
    .tag {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--warm);
      border: 1px solid #3a3530;
      padding: 4px 10px;
      border-radius: 2px;
    }

    /* ── card ── */
    .card {
      background: var(--paper);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    /* accent stripe */
    .card::before {
      content: '';
      display: block;
      height: 3px;
      background: linear-gradient(90deg, var(--rust) 0%, var(--rust2) 50%, var(--warm) 100%);
    }

    /* ── hero band ── */
    .hero {
      background: var(--ink);
      padding: 40px 48px 36px;
      position: relative;
      overflow: hidden;
    }
    .hero::after {
      content: 'UK';
      position: absolute;
      right: -12px;
      top: -18px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 120px;
      color: #ffffff08;
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }
    .hero-label {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--warm);
      margin-bottom: 10px;
    }
    .hero-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 42px;
      letter-spacing: 0.06em;
      color: var(--paper);
      line-height: 1.05;
    }

    /* ── body ── */
    .body {
      padding: 40px 48px;
    }

    .greeting {
      font-size: 14px;
      font-weight: 400;
      color: var(--muted);
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .greeting strong {
      color: var(--ink);
      font-weight: 500;
    }

    /* ── OTP block ── */
    .otp-wrap {
      background: var(--ink);
      border-radius: 3px;
      padding: 28px 32px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: relative;
      overflow: hidden;
    }
    .otp-wrap::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 18px,
        #ffffff03 18px,
        #ffffff03 19px
      );
    }
    .otp-left {
      position: relative;
    }
    .otp-hint {
      font-family: 'DM Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--warm);
      margin-bottom: 8px;
    }
    .otp-code {
      font-family: 'DM Mono', monospace;
      font-size: 38px;
      font-weight: 500;
      letter-spacing: 0.22em;
      color: var(--paper);
      line-height: 1;
    }
    .otp-right {
      position: relative;
      text-align: right;
      flex-shrink: 0;
    }
    .otp-expiry-label {
      font-family: 'DM Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .otp-expiry-value {
      font-size: 13px;
      font-weight: 500;
      color: var(--warm);
    }

    /* ── divider ── */
    .divider {
      border: none;
      border-top: 1px solid var(--line);
      margin: 0 0 28px;
    }

    /* ── notice ── */
    .notice {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: #fdf6ee;
      border: 1px solid var(--bone);
      border-left: 3px solid var(--rust);
      border-radius: 2px;
      padding: 14px 16px;
      margin-bottom: 32px;
    }
    .notice-icon {
      font-size: 14px;
      line-height: 1.5;
      flex-shrink: 0;
    }
    .notice-text {
      font-size: 12.5px;
      line-height: 1.65;
      color: var(--muted);
    }
    .notice-text strong {
      color: var(--ink);
      font-weight: 500;
    }

    /* ── cta button ── */
    .cta-wrap {
      text-align: center;
      margin-bottom: 36px;
    }
    .cta {
      display: inline-block;
      background: var(--ink);
      color: var(--paper);
      text-decoration: none;
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 14px 36px;
      border-radius: 2px;
      transition: background 0.2s;
    }
    .cta:hover { background: var(--rust); }

    /* ── steps ── */
    .steps {
      margin-bottom: 36px;
    }
    .steps-title {
      font-family: 'DM Mono', monospace;
      font-size: 9.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 16px;
    }
    .step {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .step-num {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px;
      color: var(--rust);
      line-height: 1.2;
      flex-shrink: 0;
      width: 20px;
    }
    .step-text {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.6;
      padding-top: 1px;
    }
    .step-text strong { color: var(--ink); font-weight: 500; }

    /* ── footer ── */
    .footer-band {
      background: var(--bone);
      padding: 24px 48px;
      border-top: 1px solid var(--line);
    }
    .footer-brand {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 16px;
      letter-spacing: 0.14em;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .footer-text {
      font-size: 11.5px;
      color: var(--muted);
      line-height: 1.65;
    }
    .footer-links {
      margin-top: 12px;
      display: flex;
      gap: 18px;
    }
    .footer-links a {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
      text-decoration: none;
      border-bottom: 1px solid var(--line);
      padding-bottom: 1px;
    }
    .footer-links a:hover { color: var(--rust); border-color: var(--rust); }

    /* ── bottom label ── */
    .bottom-label {
      text-align: center;
      margin-top: 20px;
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      color: #5a5450;
      text-transform: uppercase;
    }

    /* ── responsive ── */
    @media (max-width: 480px) {
      .hero, .body, .footer-band { padding-left: 28px; padding-right: 28px; }
      .otp-code { font-size: 28px; letter-spacing: 0.18em; }
      .hero-title { font-size: 32px; }
      .otp-wrap { flex-direction: column; align-items: flex-start; }
      .otp-right { text-align: left; }
    }
  </style>
</head>
<body>

<div class="shell">

  <!-- top bar -->
  <div class="topbar">
    <span class="brand">UrbanKnife</span>
    <span class="tag">Security Alert</span>
  </div>

  <div class="card">

    <!-- hero -->
    <div class="hero">
      <div class="hero-label">Password Reset</div>
      <div class="hero-title">Verify Your<br>Identity</div>
    </div>

    <!-- body -->
    <div class="body">

      <p class="greeting">
        Hi there — we received a request to reset the password linked to your
        <strong>UrbanKnife</strong> account. Use the one-time code below to continue.
        If this wasn't you, no action is needed.
      </p>

      <!-- OTP -->
      <div class="otp-wrap">
        <div class="otp-left">
          <div class="otp-hint">One-Time Password</div>
          <div class="otp-code">${otp}</div>
        </div>
        <div class="otp-right">
          <div class="otp-expiry-label">Expires in</div>
          <div class="otp-expiry-value">24 hours</div>
        </div>
      </div>

      <hr class="divider"/>

      <!-- warning -->
      <div class="notice">
        <span class="notice-icon">⚠</span>
        <div class="notice-text">
          <strong>Never share this code.</strong> UrbanKnife will never ask for your OTP
          via email, chat, or phone. Anyone requesting this code is attempting to access your account.
        </div>
      </div>

      <!-- steps -->
      <div class="steps">
        <div class="steps-title">How to use this code</div>
        <div class="step">
          <div class="step-num">01</div>
          <div class="step-text">Return to the <strong>UrbanKnife password reset page</strong> in your browser.</div>
        </div>
        <div class="step">
          <div class="step-num">02</div>
          <div class="step-text">Enter the <strong>6-digit OTP</strong> shown above in the verification field.</div>
        </div>
        <div class="step">
          <div class="step-num">03</div>
          <div class="step-text">Create your <strong>new password</strong> and confirm to regain access.</div>
        </div>
      </div>

      <!-- cta -->
    

    </div><!-- /body -->

    <!-- footer band -->
    <div class="footer-band">
      <div class="footer-brand">UrbanKnife</div>
      <div class="footer-text">
        This is an automated security message from UrbanKnife. Please do not reply directly to this email.
        For support, visit our help centre.
      </div>
      <div class="footer-links">
        <a href="#">Help Centre</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Unsubscribe</a>
      </div>
    </div>

  </div><!-- /card -->

  <div class="bottom-label">© 2025 UrbanKnife — All rights reserved</div>

</div>

</body>
</html>
            `
        })
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            email
        })
    }
    catch(error){
        next(error);
    }
}

export const verifyController=async(req,res,next)=>{
    try{
 const {otp,email}=req.body;       

 const otpData=await redis.get(`otp:${email}`);
 if(otpData!==otp){
    next(new HandleError(401,"Invalid OTP"));
 }
 await redis.del(`otp:${email}`);
 await redis.set(`verified:${email}`, "true", "EX", 10 * 60)
 res.status(200).json({
    success:true,
    message:"OTP verified successfully",
    email
 })

    }
    catch(error){
        next(error);
    }
}

export const resetController=async(req,res,next)=>{
    try{
        const {password,email}=req.body
        const user=await usermodel.findOne({email});
        if(!user){
            next(new HandleError(404,"User not found"));
        }
        const isVerified=await redis.get(`verified:${email}`);
        if(!isVerified){
            next(new HandleError(401,"OTP not verified"));
        }
        await redis.del(`verified:${email}`);
        user.password=password;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password reset successfully",
        })
    }
    catch(error){
        next(error);
    }
}
