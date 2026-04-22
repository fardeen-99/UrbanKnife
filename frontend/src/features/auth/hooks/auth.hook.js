import {seterror,setloading,setuser} from "../state/auth.slice"
import {useDispatch} from "react-redux"
import {register,login,logout,getme,forgetPassword,verifyPassword,resetPassword} from "../services/auth.service"

export const useAuth=()=>{

const dispatch=useDispatch()

const HandleRegister=async({username,email,password,contact,role,isSeller})=>{
    dispatch(setloading(true))
    try{
        const response=await register({username,email,password,contact,role,isSeller})
        dispatch(setuser(response.user))

    }catch(error){
        dispatch(seterror(error))
    }finally{
        dispatch(setloading(false))
    }
}

const HandleLogin=async({email,password})=>{
    dispatch(setloading(true))
    try{
        const response=await login({email,password})
        dispatch(setuser(response.user))
    }catch(error){
        dispatch(seterror(error))
    }finally{
        dispatch(setloading(false))
    }
}

const HandleLogout=async()=>{
    dispatch(setloading(true))
    try{
        const response=await logout()
        dispatch(setuser(null))
    }catch(error){
        dispatch(seterror(error))
    }finally{
        dispatch(setloading(false))
    }
}

const HandleGetme=async()=>{
    dispatch(setloading(true))
    try{
        const response=await getme()
        dispatch(setuser(response.user))
    }catch(error){
        dispatch(seterror(error))
    }finally{
        dispatch(setloading(false))
    }
}

const HandleForgetPassword=async(email)=>{
   
   
    try{
        const response=await forgetPassword(email)
    }catch(error){
        dispatch(seterror(error))
    }finally{
        dispatch(setloading(false))
    }
}

const HandleVerifyPassword=async({email,otp})=>{
   
    try{
        const response=await verifyPassword({email,otp})
    }catch(error){
        dispatch(seterror(error))
    }finally{   
        dispatch(setloading(false))
    }
}

const HandleResetPassword=async({email,password})=>{
   
    try{
        const response=await resetPassword({email,password})
    }catch(error){
        dispatch(seterror(error))
    }finally{
        dispatch(setloading(false))
    }
}

return{
    HandleRegister,
    HandleLogin,
    HandleLogout,
    HandleGetme,
    HandleForgetPassword,
    HandleVerifyPassword,
    HandleResetPassword
}


}