

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/state/auth.slice";
import productReducer from "../features/Products/state/product.slice";


const store=configureStore({
  reducer:{
    auth:authSlice,
    product:productReducer
  }
})
export default store