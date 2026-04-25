import { createProduct,getProductById,getMaleProducts,getFemaleProducts,getSneakers,addVariation } from "../services/product.api";
import{useDispatch} from 'react-redux'
import {setLoading,setError,setProducts,setCurrentProduct} from '../state/product.slice'

const useProduct=()=>{
    const dispatch = useDispatch()

const handleCreateProduct=async(formData)=>{
    dispatch(setLoading(true))
    try {
        const response=await createProduct(formData)
        dispatch(setProducts(response.products))
        
    }
    catch(error){
        dispatch(setError(error.response.data.message||error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 

const handleGetMaleProducts=async()=>{
    dispatch(setLoading(true))
    try {
        const response=await getMaleProducts()
        dispatch(setProducts(response.products))
        
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 
const handleGetFemaleProducts=async()=>{
    dispatch(setLoading(true))
    try {
        const response=await getFemaleProducts()
        dispatch(setProducts(response.products))
        
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 
const handleGetSneakers=async()=>{
    dispatch(setLoading(true))
    try {
        const response=await getSneakers()
        dispatch(setProducts(response.products))
        
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 

const handleGetProductById=async(id)=>{
    dispatch(setLoading(true))
    try {
        const response=await getProductById(id)
        dispatch(setCurrentProduct(response.product))
        
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 

const handleAddVariation=async(id,formData)=>{
    dispatch(setLoading(true))
    try {
        const response=await addVariation(id,formData)
        dispatch(setCurrentProduct(response))
        
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 

return {handleCreateProduct,handleGetMaleProducts,handleGetFemaleProducts,handleGetSneakers,handleGetProductById,handleAddVariation}

}

export default useProduct