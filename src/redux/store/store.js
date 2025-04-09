import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../redux/slices/userSlice.js"; 
import productReducer from "../../redux/slices/productSlice.js"
import cartReducer from "../../redux/slices/cartProduct.js"

export const store = configureStore({
  reducer: {
    user: userReducer, // Add reducers here
    product: productReducer,
    cart:cartReducer
  },
});
