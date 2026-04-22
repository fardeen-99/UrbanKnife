import { body,validationResult } from "express-validator";


const validator=(req,res,next)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();

}



export const registerValidate=[
    body("username").notEmpty().
    isLength({min:3}).withMessage("Username must be at least 3 characters long"),
    body("email").notEmpty().
    isEmail().
    withMessage("Email is invalid"),
    body("password").notEmpty().
    isLength({min:6},{
        max:12
    }).withMessage("Password must be at least 6 characters long and at most 12 characters long"),
//     body("contact").notEmpty()
//    .custom((value)=>{
//         if(!/^[0-9]{10}$/.test(value)){
//             throw new Error("Contact is invalid");
//         }
//         return true;
//     }).custom((value)=>{
//         if(value.length!==10){
//             throw new Error("Contact must be 10 digits long");
//         }
//         return true;
//     })
    
    ,

    validator
]


export const loginValidate=[
    body("email").notEmpty().
    isEmail().
    withMessage("Email is invalid"),
    body("password").notEmpty().
    isLength({min:6},{
        max:12
    }).withMessage("Password must be at least 6 characters long and at most 12 characters long"),
    validator
]