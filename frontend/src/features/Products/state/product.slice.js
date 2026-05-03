import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProductState: (state) => {
      return initialState;
    },
    setDeletedVariation: (state, action) => {
      state.currentProduct.variation = state.currentProduct.variation.filter((item) => item._id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setProducts,
  setCurrentProduct,
  setError,
  clearError,
  resetProductState,
  setDeletedVariation,
} = productSlice.actions;

export default productSlice.reducer;
