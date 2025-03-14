import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../redux/slices/userSlice.js"; 
import productReducer from "../../redux/slices/productSlice.js"


export const store = configureStore({
  reducer: {
    user: userReducer, // Add reducers here
    product: productReducer
  },
});
