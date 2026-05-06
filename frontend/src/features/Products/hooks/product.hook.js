import { createProduct,getProductById,getMaleProducts,getFemaleProducts,getSneakers,addVariation, getSellerAllProducts, getSellerProductDetail, deleteProduct, DeleteVariation, UpdateVariation, UpdateProduct } from "../services/product.api";
import{useDispatch} from 'react-redux'
import { setLoading, setError, setProducts, appendProducts, setPagination, setCurrentProduct, setDeletedVariation } from '../state/product.slice'

const useProduct=()=>{
    const dispatch = useDispatch()

const handleCreateProduct=async(formData)=>{
    dispatch(setLoading(true))
    try {
        const response=await createProduct(formData)
        // Store the newly created product as the current one so we can add variations to it
        dispatch(setCurrentProduct(response.product))
        return response.product;
    }
    catch(error){
        dispatch(setError(error.response.data.message||error.message))
        return null;
    }
    finally{
        dispatch(setLoading(false))
    }
} 

const handleGetMaleProducts = async (page = 1, isAppend = false) => {
    dispatch(setLoading(true))
    try {
        const response = await getMaleProducts(page)
        if (isAppend) {
            dispatch(appendProducts(response.products))
        } else {
            dispatch(setProducts(response.products))
        }
        dispatch(setPagination(response.pagination))
    }
    catch (error) {
        dispatch(setError(error.response?.data?.message || error.message))
    }
    finally {
        dispatch(setLoading(false))
    }
}
const handleGetFemaleProducts = async (page = 1, isAppend = false) => {
    dispatch(setLoading(true))
    try {
        const response = await getFemaleProducts(page)
        if (isAppend) {
            dispatch(appendProducts(response.products))
        } else {
            dispatch(setProducts(response.products))
        }
        dispatch(setPagination(response.pagination))
    }
    catch (error) {
        dispatch(setError(error.response?.data?.message || error.message))
    }
    finally {
        dispatch(setLoading(false))
    }
}
const handleGetSneakers = async (page = 1, isAppend = false) => {
    dispatch(setLoading(true))
    try {
        const response = await getSneakers(page)
        if (isAppend) {
            dispatch(appendProducts(response.products))
        } else {
            dispatch(setProducts(response.products))
        }
        dispatch(setPagination(response.pagination))
    }
    catch (error) {
        dispatch(setError(error.response?.data?.message || error.message))
    }
    finally {
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
        dispatch(setError(error.response?.data?.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 

const handleAddVariation=async(id,formData)=>{
    dispatch(setLoading(true))
    try {
        const response=await addVariation(id,formData)
        dispatch(setCurrentProduct(response.product))
        return response.product;
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
        return null;
    }
    finally{
        dispatch(setLoading(false))
    }
} 


const handleGetSellerAllProducts = async (page = 1, isAppend = false) => {
    dispatch(setLoading(true))
    try {
        const response = await getSellerAllProducts(page)
        if (isAppend) {
            dispatch(appendProducts(response.products))
        } else {
            dispatch(setProducts(response.products))
        }
        dispatch(setPagination(response.pagination))
    }
    catch (error) {
        dispatch(setError(error.response?.data?.message || error.message))
    }
    finally {
        dispatch(setLoading(false))
    }
}
const handleGetSellerProductDetail=async(id)=>{
    dispatch(setLoading(true))
    try {
        const response=await getSellerProductDetail(id)
        dispatch(setCurrentProduct(response.product))
        
    }
    catch(error){
        dispatch(setError(error.response?.data?.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 


const handleDeleteProduct=async(id)=>{
    dispatch(setLoading(true))
    try {
        const response=await deleteProduct(id)
        
    }
    catch(error){
        dispatch(setError(error.response?.data?.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
} 
const handleDeleteVariation=async(id,variationId)=>{
    dispatch(setLoading(true))
    try {
        const response=await DeleteVariation(id,variationId)
        dispatch(setDeletedVariation(variationId))
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
    }
    finally{
        dispatch(setLoading(false))
    }
}
const handleUpdateVariation=async(id,variationId,formData)=>{
    dispatch(setLoading(true))
    try {
        const response=await UpdateVariation(id,variationId,formData)
        // dispatch(setCurrentProduct(response.product))
        return response.product;
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
        return null;
    }
    finally{
        dispatch(setLoading(false))
    }
}

const handleUpdateProduct=async(id,formData)=>{
    dispatch(setLoading(true))
    try {
        const response=await UpdateProduct(id,formData)
        dispatch(setCurrentProduct(response.product))
        return response.product;
    }
    catch(error){
        dispatch(setError(error.response.data.message|| error.message))
        return null;
    }
    finally{
        dispatch(setLoading(false))
    }
}

return {handleCreateProduct,handleGetMaleProducts,handleGetFemaleProducts,handleGetSneakers,handleGetProductById,handleAddVariation,handleGetSellerAllProducts,handleGetSellerProductDetail,handleDeleteProduct,handleDeleteVariation,handleUpdateVariation,handleUpdateProduct}

}

export default useProduct