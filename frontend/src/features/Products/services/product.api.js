import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:"/api/product",
    withCredentials:true
})


export const createProduct=async (formData)=>{
    try {
        const response=await axiosInstance.post("/",formData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
// export const getProducts=async ()=>{
//     try {
//         const response=await axiosInstance.get("/");
//         return response.data;
//     }
//     catch(error){
//         throw error;
//     }
// }

export const getMaleProducts=async ()=>{
    try {
        const response=await axiosInstance.get("/male");
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const getFemaleProducts=async ()=>{
    try {
        const response=await axiosInstance.get("/female");
        return response.data;
    }
    catch(error){
        throw error;
    }
}
export const getSneakers=async ()=>{
    try {
        const response=await axiosInstance.get("/sneakers");
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const getProductById=async (id)=>{
    try {
        const response=await axiosInstance.get(`/${id}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
export const addVariation=async (id,formData)=>{
    try {
        const response=await axiosInstance.post(`/${id}/variation`,formData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
