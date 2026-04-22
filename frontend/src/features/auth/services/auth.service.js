import axios from 'axios'


const API=axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})

export const register=async({username,email,password,contact,role,isSeller})=>{
try{
    const response=await API.post("/register",{username,email,password,contact,role,isSeller})
    return response.data;
}catch(error){
    throw error.response.data.message;
}
}

export const login=async({email,password})=>{
try{
    const response=await API.post("/login",{email,password})
    return response.data;
}catch(error){
    throw error.response.data.message;
}
}

export const logout=async()=>{
    try{
        const response=await API.post("/logout")
        return response.data;
    }catch(error){
        throw error.response.data.message;
    }
}

export const getme=async()=>{
    try{
        const response=await API.get("/getme")
        return response.data;
    }catch(error){
        throw error.response.data.message;
    }
}

export const forgetPassword=async({email})=>{
    try{
        const response=await API.post("/forget",{email})
        return response.data;
    }catch(error){
        throw error.response.data.message;
    }
}

export const verifyPassword=async({email,otp})=>{
    try{
        const response=await API.post("/verify",{email,otp})
        return response.data;
    }catch(error){
        throw error.response.data.message;
    }
}

export const resetPassword=async({email,password})=>{
    try{
        const response=await API.post("/reset",{email,password})
        return response.data;
    }catch(error){
        throw error.response.data.message;
    }
}
