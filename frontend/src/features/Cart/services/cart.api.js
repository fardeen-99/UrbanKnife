import axios from 'axios'

const api = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addToCartApi = async ({productID, quantity, size, variationID}) => {
    try {
        const res = await api.post("/add", { productID, quantity, size, variationID })
        return res.data
    } catch (error) {
        return error
    }
}

export const getCartApi = async () => {
    try {
        const res = await api.get("/")
        return res.data
    } catch (error) {
        return error
    }
}


export const removeFromCartApi = async ({id}) => {
    try {
        const res = await api.delete(`/${id}`)
        return res.data
    } catch (error) {
        return error
    }
}
