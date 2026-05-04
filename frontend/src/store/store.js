

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/state/auth.slice";
import productReducer from "../features/Products/state/product.slice";
import cartSlice from "../features/Cart/state/cart.slice";


const store=configureStore({
  reducer:{
    auth:authSlice,
    product:productReducer,
    cart:cartSlice
  }
})
export default store