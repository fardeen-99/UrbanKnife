import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: { items: [] },
        status: "idle",
        error: null,
        isCartDrawerOpen: false
    },
    reducers: {
        addToCartRequest: (state) => {
            state.status = "loading"
        },
        addToCartSuccess: (state, action) => {
            state.status = "success"
            state.cart = action.payload
            state.error = null
        },
        addToCartFailure: (state, action) => {
            state.status = "error"
            state.error = action.payload
        },
        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            if (state.cart && state.cart.items) {
                const item = state.cart.items.find(i => i._id === id);
                if (item) {
                    item.quantity = quantity;
                }
            }
        },
        removeFromCart: (state, action) => {
            const { id } = action.payload;
            if (state.cart && state.cart.items) {
                const item = state.cart.items.find(i => i._id === id);
                if (item) {
                    state.cart.items = state.cart.items.filter(i => i._id !== id);
                }
            }
        },
        openCartDrawer: (state) => {
            state.isCartDrawerOpen = true;
        },
        closeCartDrawer: (state) => {
            state.isCartDrawerOpen = false;
        }
    }
})

export const {
    addToCartFailure,
    addToCartRequest,
    addToCartSuccess,
    updateCartQuantity,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer
} = cartSlice.actions

export default cartSlice.reducer