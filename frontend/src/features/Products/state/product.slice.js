import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  totalProducts: 0,
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
      state.page = 1; // Reset page when setting products from scratch
    },
    appendProducts: (state, action) => {
      // Avoid duplicates by checking IDs
      const newProducts = action.payload.filter(
        (newP) => !state.products.some((existingP) => existingP._id === newP._id)
      );
      state.products = [...state.products, ...newProducts];
    },
    setPagination: (state, action) => {
      state.hasMore = action.payload.hasMore;
      state.page = action.payload.currentPage;
      state.totalProducts = action.payload.totalProducts;
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
      if (state.currentProduct) {
        state.currentProduct.variation = state.currentProduct.variation.filter(
          (item) => item._id !== action.payload
        );
      }
    },
  },
});

export const {
  setLoading,
  setProducts,
  appendProducts,
  setPagination,
  setCurrentProduct,
  setError,
  clearError,
  resetProductState,
  setDeletedVariation,
} = productSlice.actions;

export default productSlice.reducer;
